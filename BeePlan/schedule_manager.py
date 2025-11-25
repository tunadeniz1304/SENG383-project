from __future__ import annotations

from typing import Dict, List

from .course import Course
from .section import Section


class ScheduleManager:
    student_schedule: Dict[str, List[Section]] = {}

    @classmethod
    def clear_schedule(cls) -> None:
        pass

    @classmethod
    def assign_sections(cls, selected_courses: List[Course]) -> None:
        pass

    @classmethod
    def _is_section_in_schedule(cls, section: Section) -> bool:
        pass

    @staticmethod
    def _time_overlaps(start1: str, end1: str, start2: str, end2: str) -> bool:
        pass

    @classmethod
    def _find_alternative_section(cls, course: Course) -> Section | None:
        pass

    @classmethod
    def print_schedule_table(cls) -> None:
        pass


