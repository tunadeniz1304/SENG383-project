from __future__ import annotations
from typing import List, Optional


class Course:
    def __init__(
        self,
        course_id: int,
        course_name: str,
        term: int,
        class_year: int,
        theory_hours: Optional[int] = None,
        lab_hours: Optional[int] = None,
        hours_text: str = "",
        instructor: str = "",
    ) -> None:
        self.course_id = course_id
        self.course_name = course_name
        self.term = term
        self.class_year = class_year
        self.sections: List[Section] = []
        self.theory_hours = theory_hours
        self.lab_hours = lab_hours
        self.hours_text = hours_text
        self.instructor = instructor

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

    def set_hours(self, theory_hours: Optional[int], lab_hours: Optional[int], hours_text: str) -> None:
        self.theory_hours = theory_hours
        self.lab_hours = lab_hours
        self.hours_text = hours_text

    def get_hours(self) -> Optional[tuple[Optional[int], Optional[int], str]]:
        return self.theory_hours, self.lab_hours, self.hours_text

    def get_instructor(self) -> str:
        return self.instructor

    @property
    def code(self) -> str:
        """Return course code (course_id as string)."""
        return str(self.course_id)

    @property
    def name(self) -> str:
        """Return course name."""
        return self.course_name

    def __str__(self) -> str:
        result = f"Course: {self.course_name} (ID: {self.course_id})\n"
        for section in self.sections:
            result += f"  {section}\n"
        return result
