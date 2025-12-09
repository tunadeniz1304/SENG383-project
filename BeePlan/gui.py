import csv
import os
import tkinter as tk
from tkinter import ttk, messagebox
from typing import Dict, List

from course import Course
from csv_processor import CSVProcessor
from schedule_manager import ScheduleManager
from student import Student


class SchedulerApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("BeePlan - Ders Programı")
        self.root.geometry("1100x760")
        self.root.configure(bg="#f7f7fb")

        # Data
        self.course_csv_path = "NEWcourses_full.csv"
        self.courses: Dict[int, Course] = CSVProcessor.load_courses(self.course_csv_path)
        self.students: List[Student] = [Student("admin", "123")]
        self.current_student: Student | None = None
        self.selected_vars: Dict[int, tk.BooleanVar] = {}
        self.instructor_courses: List[tuple[str, str, str]] = []
        self._load_instructor_courses_from_csv()
        
        # Instructor constraints data: {instructor: {day: {time_slot: availability}}}
        # availability: True = available (green), False = unavailable (red)
        self.instructor_constraints: Dict[str, Dict[str, Dict[str, bool]]] = {}
        self.current_instructor: str | None = None
        
        # Classrooms data: list of {'name': str, 'capacity': int, 'type': str}
        self.classrooms: List[Dict[str, str | int]] = []

        self._build_style()
        self._build_layout()

    def _build_style(self) -> None:
        style = ttk.Style(self.root)
        # Use clam so bg/fg customizations apply on Windows too
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass

        # Base colors
        brand = "#f59e0b"
        light_bg = "#f7f7fb"
        white = "#ffffff"
        text = "#0f172a"

        style.configure("TLabel", background=light_bg, foreground=text, font=("Segoe UI", 10))
        style.configure("Header.TLabel", background=light_bg, foreground=text, font=("Segoe UI Semibold", 16))
        style.configure("SectionTitle.TLabel", background=light_bg, foreground=text, font=("Segoe UI Semibold", 12))
        style.configure("Card.TFrame", background=white, relief="flat")
        style.configure("TButton", font=("Segoe UI", 10), padding=(10, 6))
        style.configure(
            "Accent.TButton",
            font=("Segoe UI Semibold", 10),
            background="#e0e7ff",
            foreground=text,
            padding=(12, 8),
            borderwidth=1,
        )
        style.map(
            "Accent.TButton",
            background=[("active", "#c7d2fe"), ("disabled", "#e5e7eb")],
            foreground=[("active", text), ("disabled", "#9ca3af")],
        )
        style.configure(
            "Nav.TButton",
            font=("Segoe UI", 10, "bold"),
            background=white,
            foreground=text,
            padding=(12, 6),
            borderwidth=0,
        )
        style.map(
            "Nav.TButton",
            background=[("active", "#fde68a")],
            foreground=[("active", text)],
        )
        style.configure(
            "Pill.TButton",
            font=("Segoe UI", 10, "bold"),
            background=white,
            foreground=text,
            borderwidth=1,
            padding=(10, 4),
            relief="ridge",
        )
        style.map(
            "Pill.TButton",
            background=[("active", "#e0f2fe")],
            foreground=[("active", text)],
        )
        style.configure("CourseLabel.TLabel", background="white", foreground="#111", font=("Segoe UI", 10, "bold"))
        style.configure("CourseItem.TFrame", background="white")

    def _build_layout(self) -> None:
        # Header
        container = ttk.Frame(self.root, padding=18, style="Card.TFrame")
        container.pack(fill="both", expand=True)
        ttk.Label(container, text="BeePlan: Ders Programı Oluşturma Sistemi", style="Header.TLabel").pack(anchor="w", pady=(0, 12))

        self.login_frame = ttk.Frame(container, padding=12, style="Card.TFrame")
        self.login_frame.pack(fill="x", pady=(0, 10))
        ttk.Label(self.login_frame, text="Email").grid(row=0, column=0, sticky="w")
        self.email_entry = ttk.Entry(self.login_frame, width=40)
        self.email_entry.grid(row=0, column=1, padx=8, pady=4, sticky="w")
        ttk.Label(self.login_frame, text="Password").grid(row=1, column=0, sticky="w")
        self.password_entry = ttk.Entry(self.login_frame, width=40, show="*")
        self.password_entry.grid(row=1, column=1, padx=8, pady=4, sticky="w")
        ttk.Button(self.login_frame, text="Giriş Yap", style="Accent.TButton", command=self._handle_login).grid(row=0, column=2, rowspan=2, padx=12)

        # Tabs (initially hidden until login)
        self.notebook = ttk.Notebook(container)

        # Tab 1: Veri Girişi ve Yönetimi
        self.data_tab = ttk.Frame(self.notebook, padding=12, style="Card.TFrame")
        self.notebook.add(self.data_tab, text="Veri Girişi ve Yönetimi")
        self._build_data_tab()

        # Tab 2: Çizelge ve Raporlama
        self.report_tab = ttk.Frame(self.notebook, padding=12, style="Card.TFrame")
        self.notebook.add(self.report_tab, text="Çizelge ve Raporlama")
        self._build_report_tab()

    def _handle_login(self) -> None:
        email = self.email_entry.get().strip()
        password = self.password_entry.get().strip()

        for student in self.students:
            if student.get_email() == email and student.get_password() == password:
                self.current_student = student
                messagebox.showinfo("Login", f"Hoş geldiniz, {email}!")
                self.login_frame.pack_forget()
                self.notebook.pack(fill="both", expand=True)
                return

        messagebox.showerror("Login Failed", "E-posta veya şifre hatalı.")

    def _build_data_tab(self) -> None:
        pill_bar = ttk.Frame(self.data_tab, style="Card.TFrame")
        pill_bar.pack(fill="x", pady=(0, 12))
        
        self.data_view_var = tk.StringVar(value="courses")
        self.courses_btn = ttk.Button(pill_bar, text="Dersler", style="Pill.TButton", command=lambda: self._switch_data_view("courses"))
        self.courses_btn.pack(side="left", padx=6)
        self.constraints_btn = ttk.Button(pill_bar, text="Öğretim Elemanı Kısıtları", style="Pill.TButton", command=lambda: self._switch_data_view("constraints"))
        self.constraints_btn.pack(side="left", padx=6)
        self.classrooms_btn = ttk.Button(pill_bar, text="Derslik/Lab Listesi", style="Pill.TButton", command=lambda: self._switch_data_view("classrooms"))
        self.classrooms_btn.pack(side="left", padx=6)
        self.rules_btn = ttk.Button(pill_bar, text="Kural Görüntüleyici", style="Pill.TButton", command=lambda: self._switch_data_view("rules"))
        self.rules_btn.pack(side="left", padx=6)

        info = ttk.Frame(self.data_tab, style="Card.TFrame", padding=12)
        info.pack(fill="x", pady=(0, 12))
        self.data_info_label = ttk.Label(info, text="Bu sekmede CSV/JSON yükleyip ders, öğretim elemanı ve mekan verilerini düzenleyebilirsiniz.", style="TLabel")
        self.data_info_label.pack(anchor="w")

        # Container for different views
        self.data_content = ttk.Frame(self.data_tab, style="Card.TFrame")
        self.data_content.pack(fill="both", expand=True)
        
        # Courses view (default)
        self.courses_view = ttk.Frame(self.data_content, style="Card.TFrame")
        self.courses_view.pack(fill="both", expand=True)
        
        table_wrap = ttk.Frame(self.courses_view, style="Card.TFrame")
        table_wrap.pack(fill="both", expand=True)
        ttk.Label(table_wrap, text="Sistemdeki Dersler", style="SectionTitle.TLabel").pack(anchor="w", pady=(0, 6))

        columns = ("code", "name", "term", "class", "hours", "instructor")
        self.course_data_tree = ttk.Treeview(table_wrap, columns=columns, show="headings", height=12)
        self.course_data_tree.heading("code", text="Ders Kodu")
        self.course_data_tree.heading("name", text="Ders Adı")
        self.course_data_tree.heading("term", text="Dönem")
        self.course_data_tree.heading("class", text="Sınıf")
        self.course_data_tree.heading("hours", text="Saat (T+L)")
        self.course_data_tree.heading("instructor", text="Hoca")
        self.course_data_tree.column("code", width=140, anchor="w")
        self.course_data_tree.column("name", width=320, anchor="w")
        self.course_data_tree.column("term", width=80, anchor="center")
        self.course_data_tree.column("class", width=80, anchor="center")
        self.course_data_tree.column("hours", width=90, anchor="center")
        self.course_data_tree.column("instructor", width=200, anchor="w")

        vsb = ttk.Scrollbar(table_wrap, orient="vertical", command=self.course_data_tree.yview)
        self.course_data_tree.configure(yscrollcommand=vsb.set)
        self.course_data_tree.pack(side="left", fill="both", expand=True)
        vsb.pack(side="right", fill="y")

        self._populate_course_data_tree()
        
        # Instructor constraints view (initially hidden)
        self.constraints_view = ttk.Frame(self.data_content, style="Card.TFrame")
        self._build_constraints_view()

    def _switch_data_view(self, view: str) -> None:
        """Switch between different data views."""
        if view == "courses":
            self.courses_view.pack(fill="both", expand=True)
            self.constraints_view.pack_forget()
            if hasattr(self, "classrooms_view"):
                self.classrooms_view.pack_forget()
            self.data_info_label.config(text="Bu sekmede CSV/JSON yükleyip ders, öğretim elemanı ve mekan verilerini düzenleyebilirsiniz.")
        elif view == "constraints":
            self.courses_view.pack_forget()
            if hasattr(self, "classrooms_view"):
                self.classrooms_view.pack_forget()
            self.constraints_view.pack(fill="both", expand=True)
            self.data_info_label.config(text="Algoritmanın çalışması için gerekli tüm verileri bu bölümde yükleyin ve düzenleyin")
        elif view == "classrooms":
            self.courses_view.pack_forget()
            self.constraints_view.pack_forget()
            if hasattr(self, "rules_view"):
                self.rules_view.pack_forget()
            if not hasattr(self, "classrooms_view"):
                self.classrooms_view = ttk.Frame(self.data_content, style="Card.TFrame")
                self._build_classrooms_view()
            self.classrooms_view.pack(fill="both", expand=True)
            self.data_info_label.config(text="Derslik ve laboratuvarları bu bölümde yönetin. Mekan adı, kapasite ve türünü belirtiniz.")
        elif view == "rules":
            self.courses_view.pack_forget()
            self.constraints_view.pack_forget()
            if hasattr(self, "classrooms_view"):
                self.classrooms_view.pack_forget()
            if not hasattr(self, "rules_view"):
                self.rules_view = ttk.Frame(self.data_content, style="Card.TFrame")
                self._build_rules_view()
            self.rules_view.pack(fill="both", expand=True)
            self.data_info_label.config(text="Algoritma kuralları ve kısıtlamalar burada görüntülenir.")
    
    def _build_constraints_view(self) -> None:
        """Build the instructor constraints view."""
        # Get unique instructors from CSV
        instructors = set()
        for course in self.courses.values():
            if hasattr(course, "instructor") and course.instructor:
                instructors.add(course.instructor)
        instructors = sorted(list(instructors))
        
        if not instructors:
            ttk.Label(self.constraints_view, text="Sistemde instructor bulunamadı.", style="TLabel").pack(pady=20)
            return
        
        # Main container
        main_container = ttk.Frame(self.constraints_view, style="Card.TFrame")
        main_container.pack(fill="both", expand=True, padx=12, pady=12)
        
        # Left panel - Instructor list
        left_panel = ttk.Frame(main_container, style="Card.TFrame")
        left_panel.pack(side="left", fill="y", padx=(0, 12))
        left_panel.config(width=250)
        
        ttk.Label(left_panel, text="Öğretim Elemanı Kısıtları", style="SectionTitle.TLabel").pack(anchor="w", pady=(0, 6))
        ttk.Label(left_panel, text="Her öğretim elemanının müsait olmadığı saatleri işaretleyin", style="TLabel", wraplength=230).pack(anchor="w", pady=(0, 12))
        
        ttk.Label(left_panel, text="Öğretim Elemanları", style="SectionTitle.TLabel").pack(anchor="w", pady=(0, 6))
        
        # Instructor list frame with scrollbar
        inst_list_frame = ttk.Frame(left_panel, style="Card.TFrame")
        inst_list_frame.pack(fill="both", expand=True)
        
        self.instructor_listbox = tk.Listbox(inst_list_frame, font=("Segoe UI", 10), selectmode=tk.SINGLE, height=15)
        self.instructor_listbox.pack(side="left", fill="both", expand=True)
        inst_scroll = ttk.Scrollbar(inst_list_frame, orient="vertical", command=self.instructor_listbox.yview)
        self.instructor_listbox.configure(yscrollcommand=inst_scroll.set)
        inst_scroll.pack(side="right", fill="y")
        
        for instructor in instructors:
            self.instructor_listbox.insert(tk.END, instructor)
        
        self.instructor_listbox.bind("<<ListboxSelect>>", self._on_instructor_select)
        
        # Right panel - Availability table
        right_panel = ttk.Frame(main_container, style="Card.TFrame")
        right_panel.pack(side="right", fill="both", expand=True)
        
        # Header with title and buttons
        header_frame = ttk.Frame(right_panel, style="Card.TFrame")
        header_frame.pack(fill="x", pady=(0, 12))
        
        title_frame = ttk.Frame(header_frame, style="Card.TFrame")
        title_frame.pack(side="left", fill="x", expand=True)
        ttk.Label(title_frame, text="Haftalık Müsaitlik Tablosu", style="SectionTitle.TLabel").pack(anchor="w")
        self.constraints_subtitle = ttk.Label(title_frame, text="Bir instructor seçin", style="TLabel")
        self.constraints_subtitle.pack(anchor="w")
        
        button_frame = ttk.Frame(header_frame, style="Card.TFrame")
        button_frame.pack(side="right")
        ttk.Button(button_frame, text="CSV/JSON Yükle", style="Pill.TButton").pack(side="left", padx=6)
        ttk.Button(button_frame, text="Kaydet", style="Accent.TButton", command=self._save_constraints).pack(side="left", padx=6)
        
        # Availability table
        table_container = ttk.Frame(right_panel, style="Card.TFrame")
        table_container.pack(fill="both", expand=True)
        
        # Create grid
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        day_labels_tr = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"]
        time_slots = [
            "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
            "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
        ]
        
        # Header row
        header_row = ttk.Frame(table_container, style="Card.TFrame")
        header_row.pack(fill="x")
        ttk.Label(header_row, text="Saat", width=12, style="SectionTitle.TLabel").pack(side="left", padx=2, pady=2)
        for day_tr in day_labels_tr:
            ttk.Label(header_row, text=day_tr, width=15, style="SectionTitle.TLabel", anchor="center").pack(side="left", padx=2, pady=2)
        
        # Time slot rows
        self.constraint_cells: Dict[str, Dict[str, tk.Label]] = {}
        for time_slot in time_slots:
            row_frame = ttk.Frame(table_container, style="Card.TFrame")
            row_frame.pack(fill="x")
            
            ttk.Label(row_frame, text=time_slot, width=12, style="TLabel").pack(side="left", padx=2, pady=2)
            
            self.constraint_cells[time_slot] = {}
            for day in days:
                cell = tk.Label(row_frame, text="", width=15, height=2, relief="solid", borderwidth=1, bg="#d1fae5", cursor="hand2")
                cell.pack(side="left", padx=2, pady=2)
                cell.bind("<Button-1>", lambda e, d=day, t=time_slot: self._toggle_cell(d, t))
                self.constraint_cells[time_slot][day] = cell
        
        # Legend
        legend_frame = ttk.Frame(right_panel, style="Card.TFrame")
        legend_frame.pack(fill="x", pady=(12, 0))
        ttk.Label(legend_frame, text="Gösterge:", style="TLabel").pack(side="left", padx=6)
        
        legend_green = tk.Label(legend_frame, text="", width=3, height=1, bg="#d1fae5", relief="solid", borderwidth=1)
        legend_green.pack(side="left", padx=6)
        ttk.Label(legend_frame, text="Müsait", style="TLabel").pack(side="left", padx=2)
        
        legend_red = tk.Label(legend_frame, text="", width=3, height=1, bg="#fee2e2", relief="solid", borderwidth=1)
        legend_red.pack(side="left", padx=6)
        ttk.Label(legend_frame, text="Müsait Değil", style="TLabel").pack(side="left", padx=2)
        
        legend_gray = tk.Label(legend_frame, text="", width=3, height=1, bg="#e5e7eb", relief="solid", borderwidth=1)
        legend_gray.pack(side="left", padx=6)
        ttk.Label(legend_frame, text="Sınav Bloğu (Otomatik)", style="TLabel").pack(side="left", padx=2)
    
    def _build_classrooms_view(self) -> None:
        """Build the classrooms management view."""
        main_container = ttk.Frame(self.classrooms_view, style="Card.TFrame")
        main_container.pack(fill="both", expand=True, padx=12, pady=12)
        
        # Header section
        header_frame = ttk.Frame(main_container, style="Card.TFrame")
        header_frame.pack(fill="x", pady=(0, 12))
        ttk.Label(header_frame, text="Derslik ve Laboratuvar Yönetimi", style="SectionTitle.TLabel").pack(anchor="w", side="left", expand=True)
        
        button_group = ttk.Frame(header_frame, style="Card.TFrame")
        button_group.pack(side="right")
        ttk.Button(button_group, text="CSV/JSON Yükle", style="Pill.TButton", command=self._load_classrooms_from_csv).pack(side="left", padx=6)
        ttk.Button(button_group, text="Yeni Ekle", style="Accent.TButton", command=self._add_classroom_dialog).pack(side="left", padx=6)
        
        # Input section for adding new classroom
        input_frame = ttk.Frame(main_container, style="Card.TFrame", padding=12, relief="solid")
        input_frame.pack(fill="x", pady=(0, 12))
        
        ttk.Label(input_frame, text="Mekan Adı", style="TLabel").grid(row=0, column=0, sticky="w", padx=(0, 6))
        self.classroom_name_entry = ttk.Entry(input_frame, width=25)
        self.classroom_name_entry.grid(row=0, column=1, padx=6, pady=4)
        
        ttk.Label(input_frame, text="Kapasite", style="TLabel").grid(row=0, column=2, sticky="w", padx=(12, 6))
        vcmd = (self.root.register(self._validate_numeric), '%P')
        self.classroom_capacity_entry = ttk.Entry(input_frame, width=15, validate='key', validatecommand=vcmd)
        self.classroom_capacity_entry.grid(row=0, column=3, padx=6, pady=4)
        
        ttk.Label(input_frame, text="Tür", style="TLabel").grid(row=0, column=4, sticky="w", padx=(12, 6))
        self.classroom_type_var = tk.StringVar(value="Derslik")
        type_combo = ttk.Combobox(input_frame, textvariable=self.classroom_type_var, 
                                   values=["Derslik", "Lab", "Seminer"], state="readonly", width=13)
        type_combo.grid(row=0, column=5, padx=6, pady=4)
        type_combo.bind("<<ComboboxSelected>>", self._on_classroom_type_changed)
        
        button_add = ttk.Button(input_frame, text="Ekle", style="Accent.TButton", command=self._add_classroom)
        button_add.grid(row=0, column=6, padx=12, pady=4)
        
        # Table section
        table_frame = ttk.Frame(main_container, style="Card.TFrame")
        table_frame.pack(fill="both", expand=True)
        
        ttk.Label(table_frame, text="Mekanlar", style="SectionTitle.TLabel").pack(anchor="w", pady=(0, 6))
        
        columns = ("name", "capacity", "type", "operations")
        self.classroom_tree = ttk.Treeview(table_frame, columns=columns, show="headings", height=15)
        
        self.classroom_tree.heading("name", text="Mekan Adı")
        self.classroom_tree.heading("capacity", text="Kapasite")
        self.classroom_tree.heading("type", text="Tür")
        self.classroom_tree.heading("operations", text="İşlemler")
        
        self.classroom_tree.column("name", width=300, anchor="w")
        self.classroom_tree.column("capacity", width=120, anchor="center")
        self.classroom_tree.column("type", width=150, anchor="center")
        self.classroom_tree.column("operations", width=200, anchor="center")
        
        vsb = ttk.Scrollbar(table_frame, orient="vertical", command=self.classroom_tree.yview)
        self.classroom_tree.configure(yscrollcommand=vsb.set)
        self.classroom_tree.pack(side="left", fill="both", expand=True)
        vsb.pack(side="right", fill="y")
        
        self._populate_classrooms_tree()
    
    def _validate_numeric(self, value: str) -> bool:
        """Validate that input is numeric only."""
        if value == "":
            return True
        return value.isdigit()
    
    def _on_classroom_type_changed(self, event=None) -> None:
        """Handle classroom type change - enforce capacity limits."""
        classroom_type = self.classroom_type_var.get()
        capacity_str = self.classroom_capacity_entry.get().strip()
        
        if not capacity_str:
            return
        
        try:
            capacity = int(capacity_str)
            if classroom_type == "Lab" and capacity > 40:
                messagebox.showwarning("Hata", "Lab için maksimum kapasite 40'tır. Kapasite 40'a düşürüldü.")
                self.classroom_capacity_entry.delete(0, tk.END)
                self.classroom_capacity_entry.insert(0, "40")
        except ValueError:
            pass
    
    def _add_classroom(self) -> None:
        """Add a new classroom."""
        name = self.classroom_name_entry.get().strip()
        capacity_str = self.classroom_capacity_entry.get().strip()
        classroom_type = self.classroom_type_var.get()
        
        if not name:
            messagebox.showwarning("Hata", "Lütfen mekan adını giriniz.")
            return
        if not capacity_str:
            messagebox.showwarning("Hata", "Lütfen kapasite giriniz.")
            return
        
        try:
            capacity = int(capacity_str)
            if capacity <= 0:
                raise ValueError("Kapasite pozitif olmalıdır.")
            if classroom_type == "Lab" and capacity > 40:
                messagebox.showerror("Hata", f"Lab için maksimum kapasite 40'tır. Girilen: {capacity}")
                return
        except ValueError as e:
            messagebox.showerror("Hata", f"Kapasite geçersiz: {e}")
            return
        
        # Check if classroom already exists
        for classroom in self.classrooms:
            if classroom["name"].lower() == name.lower():
                messagebox.showwarning("Hata", "Bu mekan adı zaten mevcut.")
                return
        
        # Add classroom
        self.classrooms.append({
            "name": name,
            "capacity": capacity,
            "type": classroom_type
        })
        
        # Clear inputs
        self.classroom_name_entry.delete(0, tk.END)
        self.classroom_capacity_entry.delete(0, tk.END)
        self.classroom_type_var.set("Derslik")
        
        # Refresh table
        self._populate_classrooms_tree()
        messagebox.showinfo("Başarılı", f"'{name}' mekanı başarıyla eklendi.")
    
    def _add_classroom_dialog(self) -> None:
        """Show dialog to add classroom (can be extended later)."""
        # For now, just focus on the input field
        self.classroom_name_entry.focus()
    
    def _delete_classroom(self, index: int) -> None:
        """Delete a classroom."""
        if 0 <= index < len(self.classrooms):
            classroom = self.classrooms[index]
            self.classrooms.pop(index)
            self._populate_classrooms_tree()
            messagebox.showinfo("Başarılı", f"'{classroom['name']}' mekanı silindi.")
    
    def _populate_classrooms_tree(self) -> None:
        """Populate the classrooms table."""
        if not hasattr(self, "classroom_tree"):
            return
        
        # Clear existing items
        for row in self.classroom_tree.get_children():
            self.classroom_tree.delete(row)
        
        # Add all classrooms to the table
        for idx, classroom in enumerate(self.classrooms):
            self.classroom_tree.insert(
                "",
                "end",
                values=(
                    classroom["name"],
                    str(classroom["capacity"]),
                    classroom["type"],
                    "Düzenle  |  Sil"
                ),
                tags=(f"row_{idx}",)
            )
        
        # Ensure binding is set
        try:
            self.classroom_tree.unbind("<Button-1>")
        except:
            pass
        self.classroom_tree.bind("<Button-1>", self._on_classroom_row_click)
    
    def _on_classroom_row_click(self, event) -> None:
        """Handle classroom row click for edit/delete operations."""
        item = self.classroom_tree.identify("item", event.x, event.y)
        column = self.classroom_tree.identify_column(event.x)
        
        if not item or column != "#4":  # Operations column
            return
        
        # Get index
        idx = self.classroom_tree.index(item)
        
        # Show context menu
        menu = tk.Menu(self.root, tearoff=0)
        menu.add_command(label="Düzenle", command=lambda: self._edit_classroom(idx))
        menu.add_command(label="Sil", command=lambda: self._delete_classroom_confirm(idx))
        menu.post(event.x_root, event.y_root)
    
    def _delete_classroom_confirm(self, index: int) -> None:
        """Confirm delete before removing classroom."""
        if 0 <= index < len(self.classrooms):
            classroom = self.classrooms[index]
            if messagebox.askyesno("Silme Onayı", f"'{classroom['name']}' mekanını silmek istediğinizden emin misiniz?"):
                self._delete_classroom(index)
    
    def _edit_classroom(self, index: int) -> None:
        """Edit a classroom."""
        if not (0 <= index < len(self.classrooms)):
            return
        
        classroom = self.classrooms[index]
        
        # Create edit dialog window
        edit_window = tk.Toplevel(self.root)
        edit_window.title(f"Mekanı Düzenle - {classroom['name']}")
        edit_window.geometry("400x250")
        edit_window.transient(self.root)
        edit_window.grab_set()
        
        # Main frame
        main_frame = ttk.Frame(edit_window, padding=20, style="Card.TFrame")
        main_frame.pack(fill="both", expand=True)
        
        # Name
        ttk.Label(main_frame, text="Mekan Adı", style="SectionTitle.TLabel").pack(anchor="w", pady=(0, 4))
        name_entry = ttk.Entry(main_frame, width=40)
        name_entry.insert(0, classroom["name"])
        name_entry.pack(anchor="w", pady=(0, 12))
        
        # Capacity
        ttk.Label(main_frame, text="Kapasite", style="SectionTitle.TLabel").pack(anchor="w", pady=(0, 4))
        vcmd_edit = (self.root.register(self._validate_numeric), '%P')
        capacity_entry = ttk.Entry(main_frame, width=40, validate='key', validatecommand=vcmd_edit)
        capacity_entry.insert(0, str(classroom["capacity"]))
        capacity_entry.pack(anchor="w", pady=(0, 12))
        
        # Type
        ttk.Label(main_frame, text="Tür", style="SectionTitle.TLabel").pack(anchor="w", pady=(0, 4))
        type_var = tk.StringVar(value=classroom["type"])
        type_combo = ttk.Combobox(main_frame, textvariable=type_var, 
                                   values=["Derslik", "Lab", "Seminer"], state="readonly", width=37)
        type_combo.pack(anchor="w", pady=(0, 12))
        
        # Button frame
        button_frame = ttk.Frame(main_frame, style="Card.TFrame")
        button_frame.pack(fill="x", pady=(12, 0))
        
        def save_changes():
            new_name = name_entry.get().strip()
            capacity_str = capacity_entry.get().strip()
            new_type = type_var.get()
            
            if not new_name:
                messagebox.showwarning("Hata", "Lütfen mekan adını giriniz.", parent=edit_window)
                return
            if not capacity_str:
                messagebox.showwarning("Hata", "Lütfen kapasite giriniz.", parent=edit_window)
                return
            
            try:
                capacity = int(capacity_str)
                if capacity <= 0:
                    raise ValueError("Kapasite pozitif olmalıdır.")
                if new_type == "Lab" and capacity > 40:
                    messagebox.showerror("Hata", f"Lab için maksimum kapasite 40'tır. Girilen: {capacity}", parent=edit_window)
                    return
            except ValueError as e:
                messagebox.showerror("Hata", f"Kapasite geçersiz: {e}", parent=edit_window)
                return
            
            # Check if name already exists (excluding current classroom)
            for i, cls in enumerate(self.classrooms):
                if i != index and cls["name"].lower() == new_name.lower():
                    messagebox.showwarning("Hata", "Bu mekan adı zaten mevcut.", parent=edit_window)
                    return
            
            # Update classroom
            self.classrooms[index] = {
                "name": new_name,
                "capacity": capacity,
                "type": new_type
            }
            
            self._populate_classrooms_tree()
            edit_window.destroy()
            messagebox.showinfo("Başarılı", f"'{new_name}' mekanı güncellendi.")
        
        ttk.Button(button_frame, text="Kaydet", style="Accent.TButton", command=save_changes).pack(side="left", padx=6)
        ttk.Button(button_frame, text="İptal", style="Pill.TButton", command=edit_window.destroy).pack(side="left", padx=6)
    
    def _load_classrooms_from_csv(self) -> None:
        """Load classrooms from CSV file."""
        # TODO: Implement CSV loading for classrooms
        messagebox.showinfo("Bilgi", "CSV yükleme özelliği yakında eklenecek.")
    
    def _build_rules_view(self) -> None:
        """Build the rules viewer with rule cards."""
        main_container = ttk.Frame(self.rules_view, style="Card.TFrame")
        main_container.pack(fill="both", expand=True, padx=12, pady=12)
        
        # Header
        header_frame = ttk.Frame(main_container, style="Card.TFrame")
        header_frame.pack(fill="x", pady=(0, 12))
        ttk.Label(header_frame, text="Algoritma Kuralları", style="SectionTitle.TLabel").pack(anchor="w")
        ttk.Label(header_frame, text="Ders programı oluştururken uygulanacak kurallar aşağıda listelenmiştir.", style="TLabel").pack(anchor="w", pady=(4, 0))
        
        # Rules content with scrollable frame
        canvas = tk.Canvas(main_container, bg="white", highlightthickness=0, bd=0)
        scrollbar = ttk.Scrollbar(main_container, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas, style="Card.TFrame")
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Define rules
        rules = [
            {
                "title": "Max Hoca Dersi",
                "category": "Kritik",
                "description": "Günde en fazla 4 saat teorik ders\n\nHer öğretim elemanına 1 gün içerisinde lisansüstü dersler de dahil olmak üzere en fazla 4 saatlik ders planlanmalıdır.",
                "status": "critical"
            },
            {
                "title": "Lab Sırası",
                "category": "Kritik",
                "description": "Lab, teorik dersten sonra olmalı\n\nLab dersleri, dersin teorik saatinden önce olmamalıdır. Lab seansları ilgili teorik dersten sonra planlanmalıdır.",
                "status": "critical"
            },
            {
                "title": "Cuma Kısıtı",
                "category": "Kritik",
                "description": "Cuma 13:20-15:10 arasına ders konulamaz (Sınav Bloğu)\n\nCuma günü 13:20-15:10 zaman aralığı sınav bloğu olarak ayrılmıştır ve bu saatlere hiçbir ders planlanamaz.",
                "status": "critical"
            },
            {
                "title": "Lab Kapasitesi",
                "category": "Kritik",
                "description": "Max 40 öğrenci/şube\n\nLab derslerinde 1 şubede en fazla 40 öğrenci olabilir. Daha fazla öğrenci varsa yeni şube açılmalıdır.",
                "status": "critical"
            },
            {
                "title": "Ortak Dersler Önceliği",
                "category": "Önemli",
                "description": "PHYS, MATH, ENG dersleri öncelikli\n\nÖncelikle ortak derslerin (PHYS, MATH, ENG) programı dikkate alınmalıdır.",
                "status": "warning"
            },
            {
                "title": "3. Sınıf Seçmeli Dersler",
                "category": "Önemli",
                "description": "Teknik seçmeli dersleri seçebilme\n\n3. sınıfların teknik seçmeli dersleri seçebilmesine dikkat edilecektir. Zorunlu dersler seçmeli ders saatleriyle çakışmamalıdır.",
                "status": "warning"
            },
            {
                "title": "CENG Seçmeli Program",
                "category": "Önemli",
                "description": "Seçmeli ders programı koordinasyonu\n\nCENG seçmeli ders programı dikkate alınmalı ve CENG ile SENG seçmeli dersleri çakışmamalıdır.",
                "status": "warning"
            },
            {
                "title": "Ders Kotaları",
                "category": "Bilgi",
                "description": "Kontenjan yönetimi\n\nDers kotaları ve diğer bölümlere ayrılacak olan kotalar belirlenmelidir.",
                "status": "info"
            }
        ]
        
        # Create rule cards
        for rule in rules:
            self._create_rule_card(scrollable_frame, rule)
        
        # Add some spacing at the bottom
        ttk.Label(scrollable_frame, text="", style="Card.TFrame").pack(pady=12)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
    
    def _create_rule_card(self, parent, rule: dict) -> None:
        """Create a single rule card."""
        # Card container with border effect
        card = ttk.Frame(parent, style="Card.TFrame", padding=12)
        card.pack(fill="x", pady=8, padx=8)
        
        # Color mapping for status
        status_colors = {
            "critical": "#fee2e2",
            "warning": "#fef3c7",
            "info": "#dbeafe"
        }
        
        # Top section with title and status badge
        top_frame = ttk.Frame(card, style="Card.TFrame")
        top_frame.pack(fill="x", pady=(0, 8))
        
        title_label = ttk.Label(top_frame, text=rule["title"], style="SectionTitle.TLabel")
        title_label.pack(side="left", anchor="w", expand=True)
        
        # Status badge
        status_color = status_colors.get(rule["status"], "#dbeafe")
        
        badge_frame = tk.Frame(top_frame, bg=status_color, relief="solid", borderwidth=1, padx=8, pady=4)
        badge_frame.pack(side="right", padx=(12, 0))
        badge_label = tk.Label(badge_frame, text=rule["category"], font=("Segoe UI", 9, "bold"), bg=status_color, fg="#0f172a")
        badge_label.pack()
        
        # Description
        desc_label = ttk.Label(card, text=rule["description"], style="TLabel", wraplength=500, justify="left")
        desc_label.pack(anchor="w", pady=(0, 8), fill="x")
    
    def _on_instructor_select(self, event) -> None:
        """Handle instructor selection."""
        selection = self.instructor_listbox.curselection()
        if not selection:
            return
        
        instructor = self.instructor_listbox.get(selection[0])
        self.current_instructor = instructor
        self.constraints_subtitle.config(text=f"{instructor} - Kırmızı hücreler müsait olmayan saatleri gösterir")
        self._load_instructor_constraints(instructor)
    
    def _load_instructor_constraints(self, instructor: str) -> None:
        """Load constraints for selected instructor."""
        # Initialize if not exists
        if instructor not in self.instructor_constraints:
            self.instructor_constraints[instructor] = {}
            for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]:
                self.instructor_constraints[instructor][day] = {}
                for time_slot in self.constraint_cells.keys():
                    self.instructor_constraints[instructor][day][time_slot] = True  # Default: available
        
        # Update cell colors
        for time_slot, day_cells in self.constraint_cells.items():
            for day, cell in day_cells.items():
                # Check if exam block (Friday 13:00-15:00)
                if day == "Friday" and time_slot in ["13:00-14:00", "14:00-15:00"]:
                    cell.config(bg="#e5e7eb", text="Sınav", cursor="arrow")
                    cell.unbind("<Button-1>")
                else:
                    is_available = self.instructor_constraints[instructor][day].get(time_slot, True)
                    cell.config(bg="#d1fae5" if is_available else "#fee2e2", text="", cursor="hand2")
                    cell.bind("<Button-1>", lambda e, d=day, t=time_slot: self._toggle_cell(d, t))
    
    def _toggle_cell(self, day: str, time_slot: str) -> None:
        """Toggle cell availability."""
        if not self.current_instructor:
            return
        
        # Initialize if needed
        if self.current_instructor not in self.instructor_constraints:
            self.instructor_constraints[self.current_instructor] = {}
        if day not in self.instructor_constraints[self.current_instructor]:
            self.instructor_constraints[self.current_instructor][day] = {}
        
        # Toggle availability
        current = self.instructor_constraints[self.current_instructor][day].get(time_slot, True)
        self.instructor_constraints[self.current_instructor][day][time_slot] = not current
        
        # Update cell color
        cell = self.constraint_cells[time_slot][day]
        new_available = not current
        cell.config(bg="#d1fae5" if new_available else "#fee2e2")
    
    def _save_constraints(self) -> None:
        """Save instructor constraints."""
        # TODO: Save to file (CSV/JSON)
        messagebox.showinfo("Kaydedildi", "Öğretim elemanı kısıtları kaydedildi.")
    
    def _populate_course_data_tree(self) -> None:
        if not hasattr(self, "course_data_tree"):
            return
        for row in self.course_data_tree.get_children():
            self.course_data_tree.delete(row)
        for course in sorted(self.courses.values(), key=lambda c: c.get_course_name()):
            hours_text = course.hours_text if getattr(course, "hours_text", "") else "-"
            self.course_data_tree.insert(
                "",
                "end",
                values=(
                    course.get_course_name(),
                    course.get_course_name(),
                    course.get_term(),
                    course.get_class_year(),
                    hours_text,
                    self.course_instructors.get(course.get_course_name(), "-"),
                ),
            )

    def _load_instructor_courses_from_csv(self) -> None:
        """Load instructor-course mapping from NEWcourses_full.csv (expects Instructor column)."""
        self.instructor_courses = []
        self.course_instructors: Dict[str, str] = {}
        csv_path = self.course_csv_path

        if os.path.exists(csv_path):
            try:
                with open(csv_path, newline="", encoding="utf-8") as f:
                    reader = csv.reader(f)
                    headers = next(reader, [])
                    # normalize headers
                    hdr_map = {h.strip().lower(): idx for idx, h in enumerate(headers)}
                    inst_idx = hdr_map.get("instructor")
                    code_idx = hdr_map.get("coursename")  # course code is in CourseName column
                    if inst_idx is not None and code_idx is not None:
                        seen = set()
                        for row in reader:
                            if len(row) <= max(inst_idx, code_idx):
                                continue
                            instructor = row[inst_idx].strip()
                            code = row[code_idx].strip()
                            if not instructor or not code:
                                continue
                            key = (instructor, code)
                            if key in seen:
                                continue
                            seen.add(key)
                            self.instructor_courses.append((instructor, code, code))
                            # prefer first instructor per course code
                            self.course_instructors.setdefault(code, instructor)
                        return
            except Exception as exc:
                print(f"Hoca eşleşmeleri okunamadı: {exc}")

        # fallback if no instructor column
        self.instructor_courses = []
        self.course_instructors = {}

    def _build_report_tab(self) -> None:
        filters = ttk.Frame(self.report_tab, style="Card.TFrame")
        filters.pack(fill="x", pady=(0, 10))
        ttk.Label(filters, text="Sınıf", style="SectionTitle.TLabel").grid(row=0, column=0, sticky="w")
        self.class_var = tk.StringVar(value="1")
        class_year_box = ttk.Combobox(filters, textvariable=self.class_var, values=["1", "2", "3", "4"], state="readonly", width=8)
        class_year_box.grid(row=0, column=1, padx=(6, 16))
        ttk.Label(filters, text="Dönem", style="SectionTitle.TLabel").grid(row=0, column=2, sticky="w")
        self.term_var = tk.StringVar(value="1")
        term_box = ttk.Combobox(filters, textvariable=self.term_var, values=["1", "2"], state="readonly", width=8)
        term_box.grid(row=0, column=3, padx=(6, 16))
        ttk.Button(filters, text="Dersleri Yükle", style="Pill.TButton", command=self._load_filtered_courses).grid(row=0, column=4, padx=6)
        ttk.Button(filters, text="Programı Oluştur", style="Pill.TButton", command=self._build_schedule).grid(row=0, column=5, padx=6)

        body = ttk.Frame(self.report_tab, style="Card.TFrame")
        body.pack(fill="both", expand=True)

        left = ttk.Frame(body, style="Card.TFrame")
        left.pack(side="left", fill="both", expand=True, padx=(0, 8))
        ttk.Label(left, text="Ders Seçimi", style="SectionTitle.TLabel").pack(anchor="w")

        box = ttk.Frame(left, style="Card.TFrame")
        box.pack(fill="both", expand=True, pady=(6, 0))
        box.configure(relief="solid", padding=8)

        self.course_canvas = tk.Canvas(box, bg="white", highlightthickness=0, bd=0)
        self.course_scroll = ttk.Scrollbar(left, orient="vertical", command=self.course_canvas.yview)
        self.course_list_frame = ttk.Frame(self.course_canvas, style="Card.TFrame")
        self.course_canvas.create_window((0, 0), window=self.course_list_frame, anchor="nw")
        self.course_canvas.configure(yscrollcommand=self.course_scroll.set, height=320)
        self.course_canvas.pack(side="left", fill="both", expand=True)
        self.course_scroll.pack(in_=box, side="right", fill="y")
        self.course_list_frame.bind("<Configure>", lambda e: self.course_canvas.configure(scrollregion=self.course_canvas.bbox("all")))
        self.course_widgets: Dict[int, Dict[str, object]] = {}

        right = ttk.Frame(body, style="Card.TFrame")
        right.pack(side="right", fill="both", expand=True, padx=(8, 0))
        ttk.Label(right, text="Program Tablosu", style="SectionTitle.TLabel").pack(anchor="w")
        columns = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        self.schedule_tree = ttk.Treeview(right, columns=columns, show="headings", height=16)
        for col in columns:
            self.schedule_tree.heading(col, text=col)
            width = 100 if col == "Time" else 140
            self.schedule_tree.column(col, width=width, anchor="center")
        self.schedule_tree.pack(fill="both", expand=True)

    def _load_filtered_courses(self) -> None:
        if self.current_student is None:
            messagebox.showwarning("Login Required", "Lütfen önce giriş yapın.")
            return

        self.selected_vars.clear()
        self.course_widgets.clear()
        for widget in self.course_list_frame.winfo_children():
            widget.destroy()

        class_year = int(self.class_var.get())
        term = int(self.term_var.get())

        filtered = [
            course for course in self.courses.values()
            if course.get_class_year() == class_year and course.get_term() == term
        ]

        if not filtered:
            ttk.Label(self.course_list_frame, text="Bu filtrelerde ders bulunamadı.").pack(anchor="w", pady=6)
            return

        for course in sorted(filtered, key=lambda c: c.get_course_name()):
            var = tk.BooleanVar(value=False)
            self.selected_vars[course.get_course_id()] = var
            self._add_course_row(course, var)

    def _add_course_row(self, course: Course, var: tk.BooleanVar) -> None:
        row = ttk.Frame(self.course_list_frame, style="CourseItem.TFrame")
        row.pack(anchor="w", fill="x", pady=6, padx=4)

        canvas = tk.Canvas(row, width=28, height=28, bg="white", highlightthickness=0, bd=0)
        canvas.grid(row=0, column=0, sticky="w")
        rect = canvas.create_rectangle(4, 4, 24, 24, outline="#0f172a", width=2, fill="white")

        lbl = ttk.Label(row, text=course.get_course_name(), style="CourseLabel.TLabel")
        lbl.grid(row=0, column=1, sticky="w", padx=8)

        self.course_widgets[course.get_course_id()] = {"var": var, "canvas": canvas, "rect": rect}

        def toggle(_event=None) -> None:
            var.set(not var.get())
            self._update_course_checkbox(course.get_course_id())

        canvas.bind("<Button-1>", toggle)
        lbl.bind("<Button-1>", toggle)
        row.bind("<Button-1>", toggle)

    def _update_course_checkbox(self, course_id: int) -> None:
        widget = self.course_widgets.get(course_id)
        if widget is None:
            return
        var: tk.BooleanVar = widget["var"]  # type: ignore[assignment]
        canvas: tk.Canvas = widget["canvas"]  # type: ignore[assignment]
        rect = widget["rect"]  # type: ignore[assignment]
        if var.get():
            canvas.itemconfigure(rect, fill="#4f46e5", outline="#1e1b4b")
        else:
            canvas.itemconfigure(rect, fill="white", outline="#0f172a")

    def _build_schedule(self) -> None:
        if self.current_student is None:
            messagebox.showwarning("Login Required", "Lütfen önce giriş yapın.")
            return

        self.current_student.set_class_year(int(self.class_var.get()))
        self.current_student.set_term(int(self.term_var.get()))

        selected_courses = []
        for course in self.courses.values():
            var = self.selected_vars.get(course.get_course_id())
            if var is not None and var.get():
                selected_courses.append(course)

        if not selected_courses:
            messagebox.showinfo("No Selection", "Lütfen en az bir ders seçin.")
            return

        ScheduleManager.clear_schedule()
        ScheduleManager.assign_sections(selected_courses)
        self._render_schedule_table()

    def _render_schedule_table(self) -> None:
        for row in self.schedule_tree.get_children():
            self.schedule_tree.delete(row)

        days, time_slots, table = ScheduleManager.build_schedule_matrix()
        for i, time_slot in enumerate(time_slots):
            row = [time_slot]
            for j in range(len(days)):
                cell = table[i][j] if table[i][j] else "-"
                row.append(cell)
            self.schedule_tree.insert("", "end", values=row)


def main() -> None:
    root = tk.Tk()
    SchedulerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()

