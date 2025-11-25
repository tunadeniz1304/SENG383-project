from __future__ import annotations

from typing import List, Dict

from .course import Course
from .csv_processor import CSVProcessor
from .schedule_manager import ScheduleManager
from .student import Student


class Application:
    def __init__(self) -> None:
        pass

    def load_courses(self, csv_path: str) -> None:
        pass

    def add_test_student(self) -> None:
        pass

    def login(self) -> Student | None:
        pass

    def get_class_and_term(self, student: Student) -> None:
        pass

    def display_and_select_courses(self, student: Student) -> None:
        pass

    def run(self) -> None:
        pass


