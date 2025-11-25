from __future__ import annotations

from typing import List


class Course:
    def __init__(self, course_id: int, course_name: str, term: int, class_year: int) -> None:
        pass

    def get_course_id(self) -> int:
        pass

    def set_course_id(self, course_id: int) -> None:
        pass

    def get_course_name(self) -> str:
        pass

    def set_course_name(self, course_name: str) -> None:
        pass

    def get_term(self) -> int:
        pass

    def set_term(self, term: int) -> None:
        pass

    def get_class_year(self) -> int:
        pass

    def set_class_year(self, class_year: int) -> None:
        pass

    def get_sections(self) -> List["Section"]:
        pass

    def add_section(self, section: "Section") -> None:
        pass

    def __str__(self) -> str:
        pass


