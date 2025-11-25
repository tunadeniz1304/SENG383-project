class Student:
    def __init__(self, email: str, password: str) -> None:
        self.email = email
        self.password = password
        self.class_year = 0
        self.term = 0

    def get_email(self) -> str:
        return self.email

    def set_email(self, email: str) -> None:
        self.email = email

    def get_password(self) -> str:
        return self.password

    def set_password(self, password: str) -> None:
        self.password = password

    def get_class_year(self) -> int:
        return self.class_year

    def set_class_year(self, class_year: int) -> None:
        self.class_year = class_year

    def get_term(self) -> int:
        return self.term

    def set_term(self, term: int) -> None:
        self.term = term
