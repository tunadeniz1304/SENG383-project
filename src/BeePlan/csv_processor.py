from __future__ import annotations
import csv
from typing import Dict, Optional, Tuple

from course import Course
from section import Section


class CSVProcessor:
    @staticmethod
    def _parse_hours(text: str) -> Tuple[Optional[int], Optional[int], str]:
        raw = text.strip()
        if not raw:
            return None, None, ""
        # accept formats like "3+2", "4(3+1)", "3(3+0)"
        digits = []
        current = ""
        for ch in raw:
            if ch.isdigit():
                current += ch
            else:
                if current:
                    digits.append(int(current))
                    current = ""
        if current:
            digits.append(int(current))
        theory = lab = None
        if len(digits) >= 2:
            theory, lab = digits[0], digits[1]
        elif len(digits) == 1:
            theory = digits[0]
        return theory, lab, raw

    @staticmethod
    def load_courses(file_path: str) -> Dict[int, Course]:
        courses: Dict[int, Course] = {}

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for line in reader:
                    # Required fields
                    course_id = int(line.get("CourseID", 0) or 0)
                    course_name = line.get("CourseName", "").strip()
                    term = int(line.get("Term", 0) or 0)
                    class_year = int(line.get("ClassYear", 0) or 0)
                    section_id = int(line.get("Section", 0) or 0)
                    day = line.get("Day", "").strip()
                    start_time = line.get("StartTime", "").strip()
                    end_time = line.get("EndTime", "").strip()
                    hours_text = line.get("Hours", "").strip()
                    instructor = line.get("Instructor", "").strip()
                    slot_type = line.get("Type", "Lecture").strip()

                    # parse hours if present
                    theory_hours, lab_hours, hours_raw = CSVProcessor._parse_hours(hours_text)

                    if course_id == 0 or not course_name or not day or not start_time or not end_time:
                        continue

                    # Create or retrieve Course object
                    if course_id not in courses:
                        courses[course_id] = Course(
                            course_id,
                            course_name,
                            term,
                            class_year,
                            theory_hours=theory_hours,
                            lab_hours=lab_hours,
                            hours_text=hours_raw,
                            instructor=instructor,
                        )
                    else:
                        # update hours if not set yet and provided
                        course = courses[course_id]
                        if course.theory_hours is None and theory_hours is not None:
                            course.set_hours(theory_hours, lab_hours, hours_raw)
                        if hasattr(course, "instructor") and not course.instructor and instructor:
                            course.instructor = instructor

                    course = courses[course_id]

                    # Check if section exists, else create it
                    existing_section = None
                    for sec in course.get_sections():
                        if sec.get_section_id() == section_id and sec.get_day() == day:
                            existing_section = sec
                            break

                    if existing_section is None:
                        existing_section = Section(section_id, day, course)
                        course.add_section(existing_section)

                    # Add time slot to the section with type
                    existing_section.add_time_slot(start_time, end_time, slot_type)

        except Exception as e:
            print(f"Error loading courses: {e}")
            import traceback
            traceback.print_exc()

        return courses
