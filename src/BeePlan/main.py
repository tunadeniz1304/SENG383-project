from typing import List, Dict, Optional

from course import Course
from csv_processor import CSVProcessor
from schedule_manager import ScheduleManager
from student import Student


def main():
    # Load courses from CSV
    csv_path = "NEWcourses_full.csv"
    courses: Dict[int, Course] = CSVProcessor.load_courses(csv_path)

    # Add a test student
    students: List[Student] = []
    students.append(Student("c2228036@student.cankaya.edu.tr", "123456"))

    # Login and continue
    current_student = login(students)
    if current_student is not None:
        get_class_and_term(current_student)

        program_confirmed = False

        while not program_confirmed:
            # Course selection and schedule creation
            display_and_select_courses(current_student, courses)

            # Display schedule as a table
            ScheduleManager.print_schedule_table()

            # Confirmation question
            print("Do you confirm this schedule? (yes/no): ")
            confirmation = input().strip().lower()

            if confirmation == "yes":
                program_confirmed = True
                print("Finalized schedule:")
                ScheduleManager.print_schedule_table()
                print("Thank you for using the system. Goodbye!")
            elif confirmation == "no":
                print("You can reselect your courses.")
                ScheduleManager.clear_schedule()  # Reset current schedule
            else:
                print("Invalid input. Please type 'yes' or 'no'.")


def login(students: List[Student]) -> Optional[Student]:
    print("Welcome to the Course Registration System!")
    print("Enter your email: ", end="")
    email = input()
    print("Enter your password: ", end="")
    password = input()

    for student in students:
        if student.get_email() == email and student.get_password() == password:
            print(f"Login successful! Welcome, {email}!")
            return student

    print("Invalid email or password.")
    return None


def get_class_and_term(student: Student) -> None:
    print("Enter your class year (1-4): ", end="")
    class_year = int(input())
    student.set_class_year(class_year)
    print("Enter your term (1 for Fall, 2 for Spring): ", end="")
    term = int(input())
    student.set_term(term)


def display_and_select_courses(student: Student, courses: Dict[int, Course]) -> None:
    print("Available courses for your class and term:")

    # Filter courses based on class year and term
    filtered_courses: List[Course] = []
    for course in courses.values():
        if course.get_class_year() == student.get_class_year() and course.get_term() == student.get_term():
            filtered_courses.append(course)

    # List courses
    for i, course in enumerate(filtered_courses):
        print(f"{i + 1}. {course.get_course_name()}")

    # Course selection
    print("Select the courses by entering their numbers (comma-separated): ")
    selected_input = input()
    selected = [s.strip() for s in selected_input.split(",")]
    selected_courses: List[Course] = []

    for s in selected:
        try:
            index = int(s) - 1
            if 0 <= index < len(filtered_courses):
                selected_courses.append(filtered_courses[index])
            else:
                print(f"Invalid selection: {s}")
        except ValueError:
            print(f"Invalid input: {s}")

    # Assign suitable sections to selected courses
    ScheduleManager.assign_sections(selected_courses)


if __name__ == "__main__":
    main()
