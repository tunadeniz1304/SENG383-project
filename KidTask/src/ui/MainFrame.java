package ui;

import manager.TaskManager;
import model.*;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class MainFrame extends JFrame {
    // Backend Yöneticisi
    private TaskManager taskManager;
    
    // Ekran Yönetimi
    private CardLayout cardLayout;
    private JPanel mainPanel;

    // --- TABLO VE BİLEŞENLER ---
    // Ebeveyn
    private JTable parentTaskTable;
    private DefaultTableModel parentTableModel;
    
    // Çocuk
    private JTable childTaskTable;
    private DefaultTableModel childTableModel;
    private JLabel childPointsLabel;
    
    // Öğretmen
    private JTable teacherTaskTable;
    private DefaultTableModel teacherTableModel;

    public MainFrame() {
        // 1. Backend'i başlat (Verileri yükler)
        taskManager = new TaskManager();

        // 2. Pencere Ayarları
        setTitle("KidTask - Görev ve Sorumluluk Sistemi");
        setSize(1000, 650);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null); // Ekranın ortasında aç

        // 3. CardLayout (Ekranlar arası geçiş sistemi)
        cardLayout = new CardLayout();
        mainPanel = new JPanel(cardLayout);

        // 4. Panelleri Oluştur ve Ekle
        mainPanel.add(createLoginPanel(), "Login");
        mainPanel.add(createParentPanel(), "Parent");
        mainPanel.add(createChildPanel(), "Child");
        mainPanel.add(createTeacherPanel(), "Teacher");

        add(mainPanel);
        
        // İlk açılışta Login ekranını göster
        cardLayout.show(mainPanel, "Login");
    }

    // =======================================================
    // 1. LOGIN PANELİ (ROL SEÇİMİ - BUTONLU)
    // =======================================================
    private JPanel createLoginPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(new Color(240, 248, 255)); // Açık Mavi

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 15, 15, 15);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 0; 
        
        // Başlık
        JLabel titleLabel = new JLabel("Hoşgeldiniz! Lütfen Giriş Yapın:");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        titleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        gbc.gridy = 0;
        panel.add(titleLabel, gbc);

        // --- EBEVEYN BUTONU ---
        JButton parentBtn = new JButton("EBEVEYN GİRİŞİ (Admin)");
        parentBtn.setFont(new Font("Arial", Font.BOLD, 16));
        parentBtn.setBackground(new Color(255, 215, 0)); // Altın Sarısı
        parentBtn.setPreferredSize(new Dimension(350, 60));
        gbc.gridy = 1;
        panel.add(parentBtn, gbc);

        // --- ÇOCUK BUTONU ---
        JButton childBtn = new JButton("ÇOCUK GİRİŞİ (Ali)");
        childBtn.setFont(new Font("Arial", Font.BOLD, 16));
        childBtn.setBackground(new Color(135, 206, 250)); // Gök Mavisi
        childBtn.setPreferredSize(new Dimension(350, 60));
        gbc.gridy = 2;
        panel.add(childBtn, gbc);

        // --- ÖĞRETMEN BUTONU ---
        JButton teacherBtn = new JButton("ÖĞRETMEN GİRİŞİ");
        teacherBtn.setFont(new Font("Arial", Font.BOLD, 16));
        teacherBtn.setBackground(new Color(144, 238, 144)); // Açık Yeşil
        teacherBtn.setPreferredSize(new Dimension(350, 60));
        gbc.gridy = 3;
        panel.add(teacherBtn, gbc);

        // --- AKSİYONLAR ---
        parentBtn.addActionListener(e -> attemptLogin("admin", "123", "Parent"));
        childBtn.addActionListener(e -> attemptLogin("ali", "123", "Child"));
        teacherBtn.addActionListener(e -> attemptLogin("ogretmen", "123", "Teacher"));

        return panel;
    }

    // Giriş mantığını tek yerde toplayan yardımcı metod
    private void attemptLogin(String user, String pass, String screenName) {
        if (taskManager.login(user, pass)) {
            refreshAllTables(); // Giriş yapınca tabloları güncelle
            cardLayout.show(mainPanel, screenName);
        } else {
            JOptionPane.showMessageDialog(this, 
                "Hata: '" + user + "' kullanıcısı bulunamadı!\nLütfen users.txt dosyasını kontrol edin.", 
                "Giriş Hatası", JOptionPane.ERROR_MESSAGE);
        }
    }

    // =======================================================
    // 2. EBEVEYN PANELİ
    // =======================================================
    private JPanel createParentPanel() {
        JPanel panel = new JPanel(new BorderLayout());

        // Üst Kısım
        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        topPanel.setBackground(new Color(255, 250, 205)); // Limon
        topPanel.add(new JLabel("Ebeveyn Paneli  "));
        JButton logoutBtn = new JButton("Çıkış Yap");
        logoutBtn.addActionListener(e -> cardLayout.show(mainPanel, "Login"));
        topPanel.add(logoutBtn);
        panel.add(topPanel, BorderLayout.NORTH);

        // Orta Kısım (Tablo)
        String[] columns = {"ID", "Başlık", "Açıklama", "Puan", "Tip", "Atanan", "Durum", "Rating"};
        parentTableModel = new DefaultTableModel(columns, 0);
        parentTaskTable = new JTable(parentTableModel);
        panel.add(new JScrollPane(parentTaskTable), BorderLayout.CENTER);

        // Alt Kısım (Form + Butonlar)
        JPanel bottomPanel = new JPanel(new GridLayout(2, 1));
        
        // Form
        JPanel formPanel = new JPanel(new FlowLayout());
        JTextField titleField = new JTextField(8);
        JTextField descField = new JTextField(8);
        JTextField pointsField = new JTextField(4);
        JTextField assignedField = new JTextField("ali", 5);
        JComboBox<TaskType> typeCombo = new JComboBox<>(TaskType.values());

        formPanel.add(new JLabel("Başlık:")); formPanel.add(titleField);
        formPanel.add(new JLabel("Açıklama:")); formPanel.add(descField);
        formPanel.add(new JLabel("Puan:")); formPanel.add(pointsField);
        formPanel.add(new JLabel("Kime:")); formPanel.add(assignedField);
        formPanel.add(new JLabel("Tip:")); formPanel.add(typeCombo);
        
        JButton addBtn = new JButton("Görev Ekle");
        addBtn.setBackground(new Color(255, 215, 0));
        formPanel.add(addBtn);

      
     // Onay (GÜNCELLENDİ)
        JPanel actionPanel = new JPanel(new FlowLayout());
        // Yazıyı kısalttık ve boyut verdik
        JButton approveBtn = new JButton("GÖREVİ ONAYLA");
        approveBtn.setPreferredSize(new Dimension(200, 40)); // Genişlik: 200, Yükseklik: 40
        approveBtn.setBackground(new Color(34, 139, 34)); // Orman Yeşili
        approveBtn.setForeground(Color.BLACK);
        approveBtn.setFont(new Font("Arial", Font.BOLD, 14)); // Yazı tipini ayarladık
        actionPanel.add(approveBtn);

        bottomPanel.add(formPanel);
        bottomPanel.add(actionPanel);
        panel.add(bottomPanel, BorderLayout.SOUTH);

        // --- AKSİYONLAR ---
        addBtn.addActionListener(e -> {
            try {
                taskManager.addTask(titleField.getText(), descField.getText(), 
                        Integer.parseInt(pointsField.getText()), 
                        (TaskType) typeCombo.getSelectedItem(), assignedField.getText());
                refreshAllTables();
                JOptionPane.showMessageDialog(this, "Görev Eklendi!");
            } catch (Exception ex) { JOptionPane.showMessageDialog(this, "Hata: Puan sayı olmalı."); }
        });

        approveBtn.addActionListener(e -> handleApproveAction(parentTaskTable, parentTableModel));

        return panel;
    }

    // =======================================================
    // 3. ÇOCUK PANELİ
    // =======================================================
    private JPanel createChildPanel() {
        JPanel panel = new JPanel(new BorderLayout());

        // Üst Kısım
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.setBackground(new Color(224, 255, 255));
        childPointsLabel = new JLabel("  Puan Durumu: Yükleniyor...", SwingConstants.LEFT);
        childPointsLabel.setFont(new Font("Arial", Font.BOLD, 18));
        topPanel.add(childPointsLabel, BorderLayout.WEST);
        
        JButton logoutBtn = new JButton("Çıkış");
        logoutBtn.addActionListener(e -> cardLayout.show(mainPanel, "Login"));
        topPanel.add(logoutBtn, BorderLayout.EAST);
        panel.add(topPanel, BorderLayout.NORTH);

        // Tablo
        String[] columns = {"ID", "Başlık", "Açıklama", "Puan", "Durum"};
        childTableModel = new DefaultTableModel(columns, 0);
        childTaskTable = new JTable(childTableModel);
        panel.add(new JScrollPane(childTaskTable), BorderLayout.CENTER);

        // Tamamla Butonu
        JPanel bottomPanel = new JPanel();
        JButton completeBtn = new JButton("Bu Görevi Tamamladım!");
        completeBtn.setPreferredSize(new Dimension(250, 50));
        completeBtn.setBackground(new Color(30, 144, 255)); // Koyu Mavi
        completeBtn.setForeground(Color.BLACK);
        completeBtn.setFont(new Font("Arial", Font.BOLD, 14));
        bottomPanel.add(completeBtn);
        panel.add(bottomPanel, BorderLayout.SOUTH);

        // --- AKSİYON ---
        completeBtn.addActionListener(e -> {
            int selectedRow = childTaskTable.getSelectedRow();
            if (selectedRow != -1) {
                String taskId = (String) childTableModel.getValueAt(selectedRow, 0);
                taskManager.completeTask(taskId);
                refreshAllTables();
                JOptionPane.showMessageDialog(this, "Tebrikler! Görev 'Tamamlandı' işaretlendi.\nEbeveyn onayı bekleniyor.");
            } else {
                JOptionPane.showMessageDialog(this, "Lütfen tablodan bir görev seç.");
            }
        });

        return panel;
    }

    // =======================================================
    // 4. ÖĞRETMEN PANELİ
    // =======================================================
    private JPanel createTeacherPanel() {
        JPanel panel = new JPanel(new BorderLayout());

        // Üst Kısım
        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        topPanel.setBackground(new Color(152, 251, 152)); // Soluk Yeşil
        topPanel.add(new JLabel("Öğretmen Paneli  "));
        JButton logoutBtn = new JButton("Çıkış Yap");
        logoutBtn.addActionListener(e -> cardLayout.show(mainPanel, "Login"));
        topPanel.add(logoutBtn);
        panel.add(topPanel, BorderLayout.NORTH);

        // Tablo
        String[] columns = {"ID", "Başlık", "Açıklama", "Puan", "Tip", "Atanan", "Durum", "Rating"};
        teacherTableModel = new DefaultTableModel(columns, 0);
        teacherTaskTable = new JTable(teacherTableModel);
        panel.add(new JScrollPane(teacherTaskTable), BorderLayout.CENTER);

        // Form + Butonlar
        JPanel bottomPanel = new JPanel(new GridLayout(2, 1));
        
        // Form
        JPanel formPanel = new JPanel(new FlowLayout());
        JTextField titleField = new JTextField(8);
        JTextField descField = new JTextField(8);
        JTextField pointsField = new JTextField(4);
        JTextField assignedField = new JTextField("ali", 5);
        JComboBox<TaskType> typeCombo = new JComboBox<>(TaskType.values());

        formPanel.add(new JLabel("Başlık:")); formPanel.add(titleField);
        formPanel.add(new JLabel("Açıklama:")); formPanel.add(descField);
        formPanel.add(new JLabel("Puan:")); formPanel.add(pointsField);
        formPanel.add(new JLabel("Kime:")); formPanel.add(assignedField);
        formPanel.add(new JLabel("Tip:")); formPanel.add(typeCombo);
        
        JButton addBtn = new JButton("Okul Görevi Ekle");
        addBtn.setBackground(new Color(50, 205, 50)); // Lime Yeşili
        addBtn.setForeground(Color.BLACK);
        formPanel.add(addBtn);

        // Onay
        JPanel actionPanel = new JPanel(new FlowLayout());
        JButton approveBtn = new JButton("Öğrenci Görevini ONAYLA");
        approveBtn.setBackground(new Color(34, 139, 34)); // Orman Yeşili
        approveBtn.setForeground(Color.black);
        actionPanel.add(approveBtn);

        bottomPanel.add(formPanel);
        bottomPanel.add(actionPanel);
        panel.add(bottomPanel, BorderLayout.SOUTH);

        // --- AKSİYONLAR ---
        addBtn.addActionListener(e -> {
            try {
                taskManager.addTask(titleField.getText(), descField.getText(), 
                        Integer.parseInt(pointsField.getText()), 
                        (TaskType) typeCombo.getSelectedItem(), assignedField.getText());
                refreshAllTables();
                JOptionPane.showMessageDialog(this, "Okul Görevi Eklendi!");
            } catch (Exception ex) { JOptionPane.showMessageDialog(this, "Hata: Puan sayı olmalı."); }
        });

        approveBtn.addActionListener(e -> handleApproveAction(teacherTaskTable, teacherTableModel));

        return panel;
    }

    // =======================================================
    // ORTAK YARDIMCI METODLAR
    // =======================================================
    
 // Onaylama işlemini hem Parent hem Teacher kullandığı için tek metoda aldım
    private void handleApproveAction(JTable table, DefaultTableModel model) {
        int selectedRow = table.getSelectedRow();
        if (selectedRow != -1) {
            // ID String olduğu için sorun yok
            String taskId = (String) model.getValueAt(selectedRow, 0);
            
            // --- HATA BURADAYDI, DÜZELTİLDİ ---
            // Tablodan gelen nesneyi direkt String'e cast etmek yerine .toString() kullanıyoruz.
            // Çünkü tablo içinde bu veri TaskStatus(Enum) olarak duruyor.
            String status = model.getValueAt(selectedRow, 6).toString();
            
            if(status.equals("COMPLETED")) {
                String ratingStr = JOptionPane.showInputDialog(this, "Puanınız (1-5):");
                if(ratingStr != null) {
                    try {
                        int rating = Integer.parseInt(ratingStr);
                        // 1-5 arası kontrolü
                        if (rating < 1 || rating > 5) {
                            JOptionPane.showMessageDialog(this, "Lütfen 1 ile 5 arasında bir puan verin.");
                            return;
                        }
                        
                        taskManager.approveTask(taskId, rating);
                        refreshAllTables();
                        JOptionPane.showMessageDialog(this, "Görev Onaylandı!");
                    } catch(Exception ex) { 
                        JOptionPane.showMessageDialog(this, "Geçersiz puan. Sadece sayı giriniz."); 
                    }
                }
            } else {
                JOptionPane.showMessageDialog(this, "Sadece 'COMPLETED' (Tamamlanmış) görevler onaylanabilir.\nSeçili görevin durumu: " + status);
            }
        } else {
            JOptionPane.showMessageDialog(this, "Lütfen tablodan bir görev seçin.");
        }
    }


    // TÜM TABLOLARI VE PUANLARI YENİLER
    private void refreshAllTables() {
        // Verileri Manager'dan çek (TaskManager'a eklediğimiz getter'ları kullanıyoruz)
        List<Task> allTasks = taskManager.getAllTasks();
        User currentUser = taskManager.getCurrentUser();

        // 1. Ebeveyn Tablosunu Temizle ve Doldur
        parentTableModel.setRowCount(0);
        for (Task t : allTasks) {
            parentTableModel.addRow(new Object[]{
                t.getId(), t.getTitle(), t.getDescription(), t.getPoints(), 
                t.getType(), t.getAssignedTo(), t.getStatus(), t.getRating()
            });
        }

        // 2. Öğretmen Tablosunu Temizle ve Doldur
        teacherTableModel.setRowCount(0);
        for (Task t : allTasks) {
            teacherTableModel.addRow(new Object[]{
                t.getId(), t.getTitle(), t.getDescription(), t.getPoints(), 
                t.getType(), t.getAssignedTo(), t.getStatus(), t.getRating()
            });
        }

        // 3. Çocuk Tablosunu ve Puanını Güncelle
        childTableModel.setRowCount(0);
        if (currentUser != null && currentUser.getRole() == UserRole.CHILD) {
            childPointsLabel.setText("  Merhaba " + currentUser.getUsername() + "! Toplam Puanın: " + currentUser.getTotalPoints());
            
            for (Task t : allTasks) {
                // Sadece çocuğa ait görevleri göster
                if (t.getAssignedTo().equals(currentUser.getUsername())) {
                    childTableModel.addRow(new Object[]{
                        t.getId(), t.getTitle(), t.getDescription(), t.getPoints(), t.getStatus()
                    });
                }
            }
        }
    }

    // Uygulamayı Başlatan Main
    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception ignored) {}
        SwingUtilities.invokeLater(() -> new MainFrame().setVisible(true));
    }
}