from __future__ import annotations
from typing import List


class Course:
    def __init__(self, course_id: int, course_name: str, term: int, class_year: int) -> None:
        self.course_id = course_id
        self.course_name = course_name
        self.term = term
        self.class_year = class_year
        self.sections: List[Section] = []

    def get_course_id(self) -> int:
        return self.course_id

    def set_course_id(self, course_id: int) -> None:
        self.course_id = course_id

    def get_course_name(self) -> str:
        return self.course_name

    def set_course_name(self, course_name: str) -> None:
        self.course_name = course_name

    def get_term(self) -> int:
        return self.term

    def set_term(self, term: int) -> None:
        self.term = term

    def get_class_year(self) -> int:
        return self.class_year

    def set_class_year(self, class_year: int) -> None:
        self.class_year = class_year

    def get_sections(self) -> List[Section]:
        return self.sections

    def add_section(self, section: Section) -> None:
        self.sections.append(section)

    def __str__(self) -> str:
        result = f"Course: {self.course_name} (ID: {self.course_id})\n"
        for section in self.sections:
            result += f"  {section}\n"
        return result
