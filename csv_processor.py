from __future__ import annotations
import csv
from typing import Dict

from course import Course
from section import Section


class CSVProcessor:
    @staticmethod
    def load_courses(file_path: str) -> Dict[int, Course]:
        courses: Dict[int, Course] = {}

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header

                for line in reader:
                    if len(line) < 8:
                        continue

                    course_id = int(line[0])
                    course_name = line[1]
                    term = int(line[2])
                    class_year = int(line[3])
                    section_id = int(line[4])
                    day = line[5]
                    start_time = line[6]
                    end_time = line[7]

                    # Create or retrieve Course object
                    if course_id not in courses:
                        courses[course_id] = Course(course_id, course_name, term, class_year)

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

                    # Add time slot to the section
                    existing_section.add_time_slot(start_time, end_time)

        except Exception as e:
            print(f"Error loading courses: {e}")
            import traceback
            traceback.print_exc()

        return courses
