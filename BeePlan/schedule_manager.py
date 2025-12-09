from __future__ import annotations
from typing import Dict, List, Optional

from course import Course
from section import Section


class ScheduleManager:
    student_schedule: Dict[str, List[Section]] = {}

    @classmethod
    def _time_to_minutes(cls, t: str) -> int:
        """Convert time string (HH:MM) to minutes."""
        h, m = map(int, t.split(":"))
        return h * 60 + m

    @classmethod
    def _minutes_to_time(cls, minutes: int) -> str:
        """Convert minutes to time string (HH:MM)."""
        h = minutes // 60
        m = minutes % 60
        return f"{h:02d}:{m:02d}"

    @classmethod
    def _time_overlaps(cls, start1: str, end1: str, start2: str, end2: str) -> bool:
        """Check if two time ranges overlap."""
        return not (end1 <= start2 or start1 >= end2)

    @classmethod
    def _is_exam_block(cls, day: str, start: str, end: str) -> bool:
        """Check if time slot is in exam block (Friday 13:20-15:20)."""
        if day != "Friday":
            return False
        exam_start = "13:20"
        exam_end = "15:20"
        return cls._time_overlaps(exam_start, exam_end, start, end)

    @classmethod
    def _is_lab_slot(cls, slot) -> bool:
        """Determine if a slot is a lab slot based on its type."""
        if hasattr(slot, "is_lab"):
            return slot.is_lab()
        if hasattr(slot, "get_type"):
            return slot.get_type() == "Lab"
        return False

    @classmethod
    def _get_theory_hours_for_slot(cls, start: str, end: str) -> float:
        """Calculate theory hours for a time slot (in hours)."""
        start_min = cls._time_to_minutes(start)
        end_min = cls._time_to_minutes(end)
        return (end_min - start_min) / 60.0

    @classmethod
    def _check_instructor_constraint(cls, instructor: str, day: str, start: str, end: str, course: Course) -> bool:
        """Check if adding this slot would exceed 4 hours of theory per day for instructor."""
        if not instructor:
            return True  # No constraint if no instructor
        
        # Count current theory hours for this instructor on this day
        total_theory_hours = 0.0
        
        for course_name, sections in cls.student_schedule.items():
            for section in sections:
                if section.get_day() != day:
                    continue
                
                sec_course = section.get_course()
                if not hasattr(sec_course, "instructor") or sec_course.instructor != instructor:
                    continue
                
                # Collect ALL slots for this course (all days) to determine lab slots correctly
                all_course_slots = []
                for s in sec_course.get_sections():
                    for slot in s.get_time_slots():
                        all_course_slots.append((s.get_day(), slot.get_start_time(), slot.get_end_time()))
                
                # Check each slot
                for slot in section.get_time_slots():
                    # Skip if this is a lab slot
                    if cls._is_lab_slot(slot):
                        continue
                    
                    slot_start = slot.get_start_time()
                    slot_end = slot.get_end_time()
                    
                    # Add theory hours
                    total_theory_hours += cls._get_theory_hours_for_slot(slot_start, slot_end)
        
        # Add the new slot's theory hours (only if not lab)
        # Note: We can't check if new slot is lab without the actual slot object,
        # so we'll check it in the calling code
        new_slot_hours = cls._get_theory_hours_for_slot(start, end)
        
        # Check if adding this would exceed 4 hours
        return (total_theory_hours + new_slot_hours) <= 4.0

    @classmethod
    def build_schedule_matrix(cls):
        """Return (days, time_slots, table) representing the current schedule."""
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        # Time slots as single start times (matching visual format)
        time_slots = [
            "09:20", "10:20", "11:20", "12:20",
            "13:20", "14:20", "15:20", "16:20"
        ]

        table = [["" for _ in range(len(days))] for _ in range(len(time_slots))]

        # Track which courses have already shown their lab (to avoid showing multiple lab sections)
        course_lab_shown: Dict[str, bool] = {}
        
        # First pass: collect all sections per course to determine lab slots globally
        course_sections_map: Dict[str, List[Section]] = {}
        for course_name, sections in cls.student_schedule.items():
            course_sections_map[course_name] = sections
            course_lab_shown[course_name] = False
        
        # Track which specific time slots are lab for each course (using Type from CSV)
        course_lab_slots: Dict[str, set] = {}
        
        for course_name, sections in course_sections_map.items():
            lab_slots = set()
            for section in sections:
                for slot in section.get_time_slots():
                    if cls._is_lab_slot(slot):
                        lab_slots.add((section.get_day(), slot.get_start_time(), slot.get_end_time()))
            course_lab_slots[course_name] = lab_slots
        
        # Second pass: fill the table
        for course_name, sections in cls.student_schedule.items():
            for section in sections:
                day = section.get_day()
                try:
                    day_index = days.index(day)
                except ValueError:
                    continue
                
                course = section.get_course()
                lab_slots = course_lab_slots.get(course_name, set())
                
                for slot in section.get_time_slots():
                    slot_start = slot.get_start_time()
                    slot_end = slot.get_end_time()
                    
                    # Skip exam block slots
                    if cls._is_exam_block(day, slot_start, slot_end):
                        continue
                    
                    # Check if this is a lab slot (using Type from CSV)
                    is_lab = cls._is_lab_slot(slot)
                    
                    # If this is a lab and we've already shown a lab for this course, skip it
                    if is_lab and course_lab_shown[course_name]:
                        continue
                    
                    # Find which time slot row(s) this slot overlaps with
                    slot_start_min = cls._time_to_minutes(slot_start)
                    slot_end_min = cls._time_to_minutes(slot_end)
                    
                    for i, time_slot_start in enumerate(time_slots):
                        time_slot_min = cls._time_to_minutes(time_slot_start)
                        # A time slot row represents an hour starting at that time
                        time_slot_end_min = time_slot_min + 60
                        
                        # Check if this time slot row overlaps with the course slot
                        if slot_start_min < time_slot_end_min and slot_end_min > time_slot_min:
                            name = course.get_course_name()
                            if is_lab:
                                name = f"{name} (Lab)"
                                course_lab_shown[course_name] = True
                            
                            # Only overwrite if cell is empty or if this is a lab (lab takes priority)
                            if not table[i][day_index] or is_lab:
                                table[i][day_index] = name

        return days, time_slots, table

    @classmethod
    def clear_schedule(cls) -> None:
        cls.student_schedule.clear()
        print("Schedule cleared. You can start over.")

    @classmethod
    def assign_sections(cls, selected_courses: List[Course]) -> None:
        for course in selected_courses:
            assigned = False

            for section in course.get_sections():
                # Check if this section conflicts with exam block
                has_exam_conflict = False
                for slot in section.get_time_slots():
                    if cls._is_exam_block(section.get_day(), slot.get_start_time(), slot.get_end_time()):
                        has_exam_conflict = True
                        break
                
                if has_exam_conflict:
                    continue  # Skip sections that conflict with exam block
                
                # Check instructor constraint (max 4 hours theory per day)
                instructor = course.get_instructor() if hasattr(course, "get_instructor") else ""
                if instructor:
                    violates_constraint = False
                    for slot in section.get_time_slots():
                        # Only check constraint for theory slots (not lab)
                        if not cls._is_lab_slot(slot):
                            if not cls._check_instructor_constraint(instructor, section.get_day(), slot.get_start_time(), slot.get_end_time(), course):
                                violates_constraint = True
                                break
                    
                    if violates_constraint:
                        continue  # Skip sections that violate instructor constraint
                
                # If this section is already in the schedule, continue
                if cls._is_section_in_schedule(section):
                    continue

                # Add section
                if course.get_course_name() not in cls.student_schedule:
                    cls.student_schedule[course.get_course_name()] = []
                cls.student_schedule[course.get_course_name()].append(section)
                assigned = True

                # Include all time slots for the same section
                for other_section in course.get_sections():
                    if (other_section.get_section_id() == section.get_section_id() and
                            other_section is not section and
                            not cls._is_section_in_schedule(other_section)):
                        cls.student_schedule[course.get_course_name()].append(other_section)

                break  # Once a section is assigned, no need to check others

            if not assigned:
                # If no suitable section was assigned, find an alternative
                alternative = cls._find_alternative_section(course)
                if alternative is not None:
                    if course.get_course_name() not in cls.student_schedule:
                        cls.student_schedule[course.get_course_name()] = []
                    cls.student_schedule[course.get_course_name()].append(alternative)
                    print(f"Conflict resolved: Assigned alternative section for {course.get_course_name()}")
                else:
                    print(f"Unable to assign any section for {course.get_course_name()} due to conflicts.")

    @classmethod
    def _is_section_in_schedule(cls, section: Section) -> bool:
        for sections in cls.student_schedule.values():
            for scheduled in sections:
                if scheduled.get_day() == section.get_day():
                    for slot1 in scheduled.get_time_slots():
                        for slot2 in section.get_time_slots():
                            if cls._time_overlaps(
                                slot1.get_start_time(), slot1.get_end_time(),
                                slot2.get_start_time(), slot2.get_end_time()
                            ):
                                return True  # Conflict found
        return False

    @classmethod
    def _find_alternative_section(cls, course: Course) -> Optional[Section]:
        for section in course.get_sections():
            # Check exam block constraint
            has_exam_conflict = False
            for slot in section.get_time_slots():
                if cls._is_exam_block(section.get_day(), slot.get_start_time(), slot.get_end_time()):
                    has_exam_conflict = True
                    break
            
            if has_exam_conflict:
                continue
            
            # Check instructor constraint
            instructor = course.get_instructor() if hasattr(course, "get_instructor") else ""
            if instructor:
                violates_constraint = False
                for slot in section.get_time_slots():
                    # Only check constraint for theory slots (not lab)
                    if not cls._is_lab_slot(slot):
                        if not cls._check_instructor_constraint(instructor, section.get_day(), slot.get_start_time(), slot.get_end_time(), course):
                            violates_constraint = True
                            break
                
                if violates_constraint:
                    continue
            
            if not cls._is_section_in_schedule(section):
                return section  # Return the first non-conflicting section
        return None  # No alternative found

    @classmethod
    def print_schedule_table(cls) -> None:
        days, time_slots, table = cls.build_schedule_matrix()

        print("--------------------------------------------------------------------------------")
        print(f"{'Time':<10}", end="")
        for day in days:
            print(f"{day:<15}", end="")
        print()
        print("--------------------------------------------------------------------------------")

        for i, time_slot in enumerate(time_slots):
            print(f"{time_slot:<10}", end="")
            for j in range(len(days)):
                cell_content = table[i][j] if table[i][j] else "-"
                print(f"{cell_content:<15}", end="")
            print()

        print("--------------------------------------------------------------------------------")
