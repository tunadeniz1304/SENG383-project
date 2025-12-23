package ui;

import manager.TaskManager;
import model.*;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
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
    private JPanel childWishPanel;
    
    // Öğretmen
    private JTable teacherTaskTable;
    private DefaultTableModel teacherTableModel;

    // Modern renkler
    private static final Color PRIMARY_COLOR = new Color(70, 130, 180); // Steel Blue
    private static final Color SECONDARY_COLOR = new Color(255, 140, 0); // Dark Orange
    private static final Color SUCCESS_COLOR = new Color(34, 139, 34); // Forest Green
    private static final Color BACKGROUND_LIGHT = new Color(248, 250, 252);
    private static final Color CARD_BACKGROUND = Color.WHITE;

    public MainFrame() {
        // 1. Backend'i başlat (Verileri yükler)
        taskManager = new TaskManager();

        // 2. Pencere Ayarları
        setTitle("KidTask - Görev ve Sorumluluk Sistemi");
        setSize(1200, 750);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null); // Ekranın ortasında aç

        // 3. CardLayout (Ekranlar arası geçiş sistemi)
        cardLayout = new CardLayout();
        mainPanel = new JPanel(cardLayout);
        mainPanel.setBackground(BACKGROUND_LIGHT);

        // 4. Panelleri Oluştur ve Ekle
        mainPanel.add(createLoginPanel(), "Login");
        mainPanel.add(createParentPanel(), "Parent");
        mainPanel.add(createChildPanel(), "Child");
        mainPanel.add(createTeacherPanel(), "Teacher");

        add(mainPanel);
        
        // İlk açılışta Login ekranını göster
        cardLayout.show(mainPanel, "Login");
    }

    // Modern buton oluşturma yardımcı metodu
    private JButton createStyledButton(String text, Color bgColor, Color hoverColor, int width, int height) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 16));
        btn.setBackground(bgColor);
        btn.setForeground(Color.BLACK);
        btn.setPreferredSize(new Dimension(width, height));
        btn.setFocusPainted(true);
        btn.setBorderPainted(true);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        
        // Kaliteli border ve shadow efekti
        Color borderColor = new Color(
            Math.max(0, bgColor.getRed() - 40),
            Math.max(0, bgColor.getGreen() - 40),
            Math.max(0, bgColor.getBlue() - 40)
        );
        btn.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(borderColor, 2),
            BorderFactory.createEmptyBorder(12, 25, 12, 25)
        ));
        
        // Hover efekti - border ve background değişimi
        btn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                btn.setBackground(hoverColor);
                Color hoverBorderColor = new Color(
                    Math.max(0, hoverColor.getRed() - 40),
                    Math.max(0, hoverColor.getGreen() - 40),
                    Math.max(0, hoverColor.getBlue() - 40)
                );
                btn.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(hoverBorderColor, 3),
                    BorderFactory.createEmptyBorder(11, 24, 11, 24)
                ));
            }
            @Override
            public void mouseExited(MouseEvent e) {
                btn.setBackground(bgColor);
                btn.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(borderColor, 2),
                    BorderFactory.createEmptyBorder(12, 25, 12, 25)
                ));
            }
            @Override
            public void mousePressed(MouseEvent e) {
                btn.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(borderColor, 2),
                    BorderFactory.createEmptyBorder(13, 26, 11, 24)
                ));
            }
            @Override
            public void mouseReleased(MouseEvent e) {
                btn.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(borderColor, 2),
                    BorderFactory.createEmptyBorder(12, 25, 12, 25)
                ));
            }
        });
        
        return btn;
    }

    // =======================================================
    // 1. LOGIN PANELİ (ROL SEÇİMİ - BUTONLU)
    // =======================================================
    private JPanel createLoginPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(BACKGROUND_LIGHT);

        // Ana içerik paneli (ortalanmış)
        JPanel contentPanel = new JPanel(new GridBagLayout());
        contentPanel.setBackground(BACKGROUND_LIGHT);
        contentPanel.setBorder(BorderFactory.createEmptyBorder(40, 40, 40, 40));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(20, 20, 20, 20);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 0; 
        
        // Başlık Paneli
        JPanel titlePanel = new JPanel(new BorderLayout());
        titlePanel.setBackground(BACKGROUND_LIGHT);
        titlePanel.setBorder(BorderFactory.createEmptyBorder(20, 0, 20, 0));
        
        JLabel titleLabel = new JLabel("KidTask");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 48));
        titleLabel.setForeground(PRIMARY_COLOR);
        titleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        titlePanel.add(titleLabel, BorderLayout.CENTER);
        
        gbc.gridy = 0;
        gbc.insets = new Insets(0, 0, 15, 0);
        contentPanel.add(titlePanel, gbc);

        // Alt başlık
        JLabel subtitleLabel = new JLabel("Görev ve Sorumluluk Yönetim Sistemi");
        subtitleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 18));
        subtitleLabel.setForeground(new Color(100, 100, 100));
        subtitleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        gbc.gridy = 1;
        gbc.insets = new Insets(0, 0, 50, 0);
        contentPanel.add(subtitleLabel, gbc);

        // --- EBEVEYN BUTONU ---
        JButton parentBtn = createStyledButton("👨‍👩‍👧 EBEVEYN GİRİŞİ (Admin)", 
            new Color(255, 140, 0), new Color(255, 165, 0), 400, 70);
        gbc.gridy = 2;
        gbc.insets = new Insets(10, 0, 10, 0);
        contentPanel.add(parentBtn, gbc);

        // --- ÇOCUK BUTONU ---
        JButton childBtn = createStyledButton("👦 ÇOCUK GİRİŞİ (Ali)", 
            new Color(70, 130, 180), new Color(100, 149, 237), 400, 70);
        gbc.gridy = 3;
        contentPanel.add(childBtn, gbc);

        // --- ÖĞRETMEN BUTONU ---
        JButton teacherBtn = createStyledButton("👩‍🏫 ÖĞRETMEN GİRİŞİ", 
            new Color(34, 139, 34), new Color(50, 205, 50), 400, 70);
        gbc.gridy = 4;
        contentPanel.add(teacherBtn, gbc);

        // Kapat butonu
        JButton closeBtn = createStyledButton("❌ Uygulamayı Kapat", 
            new Color(220, 20, 60), new Color(255, 69, 0), 400, 60);
        gbc.gridy = 5;
        gbc.insets = new Insets(30, 0, 0, 0);
        contentPanel.add(closeBtn, gbc);

        // İçerik panelini ana panele ekle
        panel.add(contentPanel, BorderLayout.CENTER);

        // --- AKSİYONLAR ---
        parentBtn.addActionListener(e -> attemptLogin("admin", "123", "Parent"));
        childBtn.addActionListener(e -> attemptLogin("ali", "123", "Child"));
        teacherBtn.addActionListener(e -> attemptLogin("ogretmen", "123", "Teacher"));
        closeBtn.addActionListener(e -> {
            int option = JOptionPane.showConfirmDialog(this, 
                "Uygulamayı kapatmak istediğinize emin misiniz?", 
                "Çıkış", 
                JOptionPane.YES_NO_OPTION);
            if (option == JOptionPane.YES_OPTION) {
                System.exit(0);
            }
        });

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

    // Text field stilini ayarlama yardımcı metodu
    private void styleTextField(JTextField field) {
        field.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(180, 190, 200), 1),
            BorderFactory.createEmptyBorder(5, 8, 5, 8)
        ));
    }
    
    // ComboBox stilini ayarlama yardımcı metodu
    private void styleComboBox(JComboBox<?> combo) {
        combo.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(180, 190, 200), 1),
            BorderFactory.createEmptyBorder(5, 8, 5, 8)
        ));
    }

    // Tablo stilini ayarlama yardımcı metodu
    private void styleTable(JTable table) {
        table.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        table.setRowHeight(35);
        table.setSelectionBackground(new Color(70, 130, 180, 150));
        table.setSelectionForeground(Color.BLACK);
        table.setGridColor(new Color(220, 220, 220));
        table.setShowGrid(true);
        table.setIntercellSpacing(new Dimension(0, 0));
        table.setFillsViewportHeight(true);
        
        // Alternatif satır renkleri
        table.setDefaultRenderer(Object.class, new javax.swing.table.DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected,
                    boolean hasFocus, int row, int column) {
                Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                if (!isSelected) {
                    c.setBackground(row % 2 == 0 ? Color.WHITE : new Color(248, 250, 252));
                }
                if (c instanceof javax.swing.JComponent) {
                    ((javax.swing.JComponent) c).setBorder(BorderFactory.createEmptyBorder(5, 10, 5, 10));
                }
                return c;
            }
        });
        
        JTableHeader header = table.getTableHeader();
        header.setFont(new Font("Segoe UI", Font.BOLD, 14));
        header.setBackground(new Color(240, 245, 250));
        header.setForeground(new Color(30, 30, 30));
        header.setReorderingAllowed(false);
        header.setPreferredSize(new Dimension(header.getWidth(), 40));
        
        // Header border ve padding
        if (header instanceof javax.swing.JComponent) {
            ((javax.swing.JComponent) header).setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(200, 210, 220), 1),
                BorderFactory.createEmptyBorder(8, 10, 8, 10)
            ));
        }
    }

    // =======================================================
    // 2. EBEVEYN PANELİ
    // =======================================================
    private JPanel createParentPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(BACKGROUND_LIGHT);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Üst Kısım
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.setBackground(new Color(255, 200, 100));
        topPanel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createCompoundBorder(
                BorderFactory.createRaisedBevelBorder(),
                BorderFactory.createLineBorder(new Color(255, 165, 0), 2)
            ),
            BorderFactory.createEmptyBorder(15, 20, 15, 20)));
        
        JLabel titleLabel = new JLabel("👨‍👩‍👧 EBEVEYN PANELİ");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 20));
        titleLabel.setForeground(new Color(139, 69, 19));
        topPanel.add(titleLabel, BorderLayout.WEST);
        
        JButton logoutBtn = createStyledButton("Çıkış Yap", 
            new Color(220, 20, 60), new Color(255, 69, 0), 120, 40);
        logoutBtn.addActionListener(e -> cardLayout.show(mainPanel, "Login"));
        topPanel.add(logoutBtn, BorderLayout.EAST);
        panel.add(topPanel, BorderLayout.NORTH);

        // Orta Kısım (Tablo)
        String[] columns = {"ID", "Başlık", "Açıklama", "Puan", "Tip", "Atanan", "Durum", "Rating"};
        parentTableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        parentTaskTable = new JTable(parentTableModel);
        styleTable(parentTaskTable);
        
        JScrollPane scrollPane = new JScrollPane(parentTaskTable);
        scrollPane.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(180, 190, 200), 2),
                "📋 Tüm Görevler", 0, 0, new Font("Segoe UI", Font.BOLD, 15), PRIMARY_COLOR),
            BorderFactory.createEmptyBorder(5, 5, 5, 5)
        ));
        scrollPane.setBackground(CARD_BACKGROUND);
        scrollPane.getViewport().setBackground(Color.WHITE);
        panel.add(scrollPane, BorderLayout.CENTER);

        // Alt Kısım (Form + Butonlar)
        JPanel bottomPanel = new JPanel(new BorderLayout());
        bottomPanel.setBackground(BACKGROUND_LIGHT);
        bottomPanel.setBorder(BorderFactory.createEmptyBorder(10, 0, 0, 0));
        
        // Form
        JPanel formPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 12));
        formPanel.setBackground(CARD_BACKGROUND);
        formPanel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(180, 190, 200), 2),
                "➕ Yeni Görev Ekle", 0, 0, new Font("Segoe UI", Font.BOLD, 14), PRIMARY_COLOR),
            BorderFactory.createEmptyBorder(8, 8, 8, 8)
        ));
        
        JTextField titleField = new JTextField(12);
        titleField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleTextField(titleField);
        JTextField descField = new JTextField(15);
        descField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleTextField(descField);
        JTextField pointsField = new JTextField(5);
        pointsField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleTextField(pointsField);
        JTextField assignedField = new JTextField("ali", 8);
        assignedField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleTextField(assignedField);
        JComboBox<TaskType> typeCombo = new JComboBox<>(TaskType.values());
        typeCombo.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleComboBox(typeCombo);

        formPanel.add(new JLabel("Başlık:"));
        formPanel.add(titleField);
        formPanel.add(new JLabel("Açıklama:"));
        formPanel.add(descField);
        formPanel.add(new JLabel("Puan:"));
        formPanel.add(pointsField);
        formPanel.add(new JLabel("Kime:"));
        formPanel.add(assignedField);
        formPanel.add(new JLabel("Tip:"));
        formPanel.add(typeCombo);
        
        JButton addBtn = createStyledButton("➕ Görev Ekle", 
            SECONDARY_COLOR, new Color(255, 165, 0), 150, 40);
        formPanel.add(addBtn);

        // Onay butonu
        JPanel actionPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        actionPanel.setBackground(CARD_BACKGROUND);
        JButton approveBtn = createStyledButton("✅ Görevi Onayla", 
            SUCCESS_COLOR, new Color(50, 205, 50), 200, 45);
        approveBtn.setFont(new Font("Segoe UI", Font.BOLD, 14));
        actionPanel.add(approveBtn);

        bottomPanel.add(formPanel, BorderLayout.NORTH);
        bottomPanel.add(actionPanel, BorderLayout.SOUTH);
        panel.add(bottomPanel, BorderLayout.SOUTH);

        // --- AKSİYONLAR ---
        addBtn.addActionListener(e -> {
            try {
                if (titleField.getText().trim().isEmpty() || descField.getText().trim().isEmpty()) {
                    JOptionPane.showMessageDialog(this, "Lütfen başlık ve açıklama alanlarını doldurun.", 
                        "Eksik Bilgi", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                taskManager.addTask(titleField.getText(), descField.getText(), 
                        Integer.parseInt(pointsField.getText()), 
                        (TaskType) typeCombo.getSelectedItem(), assignedField.getText());
                refreshAllTables();
                titleField.setText("");
                descField.setText("");
                pointsField.setText("");
                assignedField.setText("ali");
                JOptionPane.showMessageDialog(this, "✅ Görev başarıyla eklendi!", 
                    "Başarılı", JOptionPane.INFORMATION_MESSAGE);
            } catch (NumberFormatException ex) { 
                JOptionPane.showMessageDialog(this, "❌ Hata: Puan sayı olmalı.", 
                    "Hata", JOptionPane.ERROR_MESSAGE); 
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "❌ Hata: " + ex.getMessage(), 
                    "Hata", JOptionPane.ERROR_MESSAGE);
            }
        });

        approveBtn.addActionListener(e -> handleApproveAction(parentTaskTable, parentTableModel));

        return panel;
    }

    // =======================================================
    // 3. ÇOCUK PANELİ
    // =======================================================
    private JPanel createChildPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(BACKGROUND_LIGHT);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Üst Kısım
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.setBackground(new Color(173, 216, 230));
        topPanel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createCompoundBorder(
                BorderFactory.createRaisedBevelBorder(),
                BorderFactory.createLineBorder(new Color(70, 130, 180), 2)
            ),
            BorderFactory.createEmptyBorder(20, 25, 20, 25)));
        
        childPointsLabel = new JLabel("  ⭐ Puan Durumu: Yükleniyor...", SwingConstants.LEFT);
        childPointsLabel.setFont(new Font("Segoe UI", Font.BOLD, 20));
        childPointsLabel.setForeground(new Color(25, 25, 112));
        topPanel.add(childPointsLabel, BorderLayout.WEST);
        
        JButton logoutBtn = createStyledButton("Çıkış", 
            new Color(220, 20, 60), new Color(255, 69, 0), 100, 40);
        logoutBtn.addActionListener(e -> cardLayout.show(mainPanel, "Login"));
        topPanel.add(logoutBtn, BorderLayout.EAST);
        panel.add(topPanel, BorderLayout.NORTH);

        // Orta kısım - Tablo ve Wish listesi yan yana
        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.setBackground(BACKGROUND_LIGHT);
        
        // Sol taraf - Görevler Tablosu
        String[] columns = {"ID", "Başlık", "Açıklama", "Puan", "Durum"};
        childTableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        childTaskTable = new JTable(childTableModel);
        styleTable(childTaskTable);
        
        JScrollPane scrollPane = new JScrollPane(childTaskTable);
        scrollPane.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(180, 190, 200), 2),
                "📋 Benim Görevlerim", 0, 0, new Font("Segoe UI", Font.BOLD, 15), PRIMARY_COLOR),
            BorderFactory.createEmptyBorder(5, 5, 5, 5)
        ));
        scrollPane.setBackground(CARD_BACKGROUND);
        scrollPane.getViewport().setBackground(Color.WHITE);
        centerPanel.add(scrollPane, BorderLayout.CENTER);
        
        // Sağ taraf - Wish Listesi
        JPanel wishPanel = new JPanel();
        wishPanel.setLayout(new BoxLayout(wishPanel, BoxLayout.Y_AXIS));
        wishPanel.setBackground(CARD_BACKGROUND);
        wishPanel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(180, 190, 200), 2),
                "🎁 Hayallerim (Puanla yapabilirsin)", 0, 0, new Font("Segoe UI", Font.BOLD, 15), new Color(255, 140, 0)),
            BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));
        wishPanel.setPreferredSize(new Dimension(300, 0));
        
        JScrollPane wishScrollPane = new JScrollPane(wishPanel);
        wishScrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
        wishScrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        wishScrollPane.setBorder(BorderFactory.createEmptyBorder());
        centerPanel.add(wishScrollPane, BorderLayout.EAST);
        
        panel.add(centerPanel, BorderLayout.CENTER);
        
        // Wish panelini refresh metodunda güncellemek için referans sakla
        childWishPanel = wishPanel;
        refreshWishPanel();

        // Tamamla Butonu
        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 15));
        bottomPanel.setBackground(BACKGROUND_LIGHT);
        JButton completeBtn = createStyledButton("✅ Bu Görevi Tamamladım!", 
            new Color(30, 144, 255), new Color(100, 149, 237), 280, 55);
        completeBtn.setFont(new Font("Segoe UI", Font.BOLD, 15));
        bottomPanel.add(completeBtn);
        panel.add(bottomPanel, BorderLayout.SOUTH);

        // --- AKSİYON ---
        completeBtn.addActionListener(e -> {
            int selectedRow = childTaskTable.getSelectedRow();
            if (selectedRow != -1) {
                String taskId = (String) childTableModel.getValueAt(selectedRow, 0);
                String taskTitle = (String) childTableModel.getValueAt(selectedRow, 1);
                String taskStatus = childTableModel.getValueAt(selectedRow, 4).toString();
                
                // APPROVED görevler tekrar tamamlanamaz
                if (taskStatus.equals("APPROVED")) {
                    JOptionPane.showMessageDialog(this, 
                        "Bu görev zaten onaylanmış!\n\n" +
                        "Onaylanmış görevlerin durumu değiştirilemez.",
                        "Uyarı", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                
                // COMPLETED görevler tekrar tamamlanamaz
                if (taskStatus.equals("COMPLETED")) {
                    JOptionPane.showMessageDialog(this, 
                        "Bu görev zaten tamamlandı olarak işaretlenmiş!\n\n" +
                        "Ebeveyn onayı bekleniyor.",
                        "Uyarı", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                
                if (taskManager.completeTask(taskId)) {
                    refreshAllTables();
                    JOptionPane.showMessageDialog(this, 
                        "🎉 Tebrikler!\n\n'" + taskTitle + "' görevi tamamlandı olarak işaretlendi.\n\n" +
                        "Ebeveyn onayı bekleniyor. Onaylandığında puanların hesabına eklenecek!",
                        "Görev Tamamlandı", JOptionPane.INFORMATION_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(this, 
                        "❌ Hata: Bu görevin durumu değiştirilemez!",
                        "Hata", JOptionPane.ERROR_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(this, "⚠️ Lütfen tablodan bir görev seçin.", 
                    "Uyarı", JOptionPane.WARNING_MESSAGE);
            }
        });

        return panel;
    }

    // =======================================================
    // 4. ÖĞRETMEN PANELİ
    // =======================================================
    private JPanel createTeacherPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(BACKGROUND_LIGHT);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Üst Kısım
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.setBackground(new Color(144, 238, 144));
        topPanel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createCompoundBorder(
                BorderFactory.createRaisedBevelBorder(),
                BorderFactory.createLineBorder(new Color(34, 139, 34), 2)
            ),
            BorderFactory.createEmptyBorder(15, 20, 15, 20)));
        
        JLabel titleLabel = new JLabel("👩‍🏫 ÖĞRETMEN PANELİ");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 20));
        titleLabel.setForeground(new Color(0, 100, 0));
        topPanel.add(titleLabel, BorderLayout.WEST);
        
        JButton logoutBtn = createStyledButton("Çıkış Yap", 
            new Color(220, 20, 60), new Color(255, 69, 0), 120, 40);
        logoutBtn.addActionListener(e -> cardLayout.show(mainPanel, "Login"));
        topPanel.add(logoutBtn, BorderLayout.EAST);
        panel.add(topPanel, BorderLayout.NORTH);

        // Tablo
        String[] columns = {"ID", "Başlık", "Açıklama", "Puan", "Tip", "Atanan", "Durum", "Rating"};
        teacherTableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        teacherTaskTable = new JTable(teacherTableModel);
        styleTable(teacherTaskTable);
        
        JScrollPane scrollPane = new JScrollPane(teacherTaskTable);
        scrollPane.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(180, 190, 200), 2),
                "📋 Tüm Görevler", 0, 0, new Font("Segoe UI", Font.BOLD, 15), SUCCESS_COLOR),
            BorderFactory.createEmptyBorder(5, 5, 5, 5)
        ));
        scrollPane.setBackground(CARD_BACKGROUND);
        scrollPane.getViewport().setBackground(Color.WHITE);
        panel.add(scrollPane, BorderLayout.CENTER);

        // Form + Butonlar
        JPanel bottomPanel = new JPanel(new BorderLayout());
        bottomPanel.setBackground(BACKGROUND_LIGHT);
        bottomPanel.setBorder(BorderFactory.createEmptyBorder(10, 0, 0, 0));
        
        // Form
        JPanel formPanel = new JPanel();
        formPanel.setLayout(new BoxLayout(formPanel, BoxLayout.X_AXIS));
        formPanel.setBackground(CARD_BACKGROUND);
        formPanel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(180, 190, 200), 2),
                "➕ Yeni Okul Görevi Ekle", 0, 0, new Font("Segoe UI", Font.BOLD, 14), SUCCESS_COLOR),
            BorderFactory.createEmptyBorder(8, 8, 8, 8)
        ));
        
        // Form elemanları için iç panel
        JPanel formFieldsPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 0));
        formFieldsPanel.setBackground(CARD_BACKGROUND);
        
        JTextField titleField = new JTextField(12);
        titleField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleTextField(titleField);
        JTextField descField = new JTextField(15);
        descField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleTextField(descField);
        JTextField pointsField = new JTextField(5);
        pointsField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleTextField(pointsField);
        JTextField assignedField = new JTextField("ali", 8);
        assignedField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleTextField(assignedField);
        JComboBox<TaskType> typeCombo = new JComboBox<>(TaskType.values());
        typeCombo.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        styleComboBox(typeCombo);

        formFieldsPanel.add(new JLabel("Başlık:"));
        formFieldsPanel.add(titleField);
        formFieldsPanel.add(new JLabel("Açıklama:"));
        formFieldsPanel.add(descField);
        formFieldsPanel.add(new JLabel("Puan:"));
        formFieldsPanel.add(pointsField);
        formFieldsPanel.add(new JLabel("Kime:"));
        formFieldsPanel.add(assignedField);
        formFieldsPanel.add(new JLabel("Tip:"));
        formFieldsPanel.add(typeCombo);
        
        JButton addBtn = createStyledButton("➕ Okul Görevi Ekle", 
            SUCCESS_COLOR, new Color(50, 205, 50), 180, 40);
        
        formPanel.add(formFieldsPanel);
        formPanel.add(Box.createHorizontalGlue());
        formPanel.add(addBtn);

        // Onay
        JPanel actionPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        actionPanel.setBackground(CARD_BACKGROUND);
        JButton approveBtn = createStyledButton("✅ Öğrenci Görevini Onayla", 
            SUCCESS_COLOR, new Color(50, 205, 50), 250, 45);
        approveBtn.setFont(new Font("Segoe UI", Font.BOLD, 14));
        actionPanel.add(approveBtn);

        bottomPanel.add(formPanel, BorderLayout.NORTH);
        bottomPanel.add(actionPanel, BorderLayout.SOUTH);
        panel.add(bottomPanel, BorderLayout.SOUTH);

        // --- AKSİYONLAR ---
        addBtn.addActionListener(e -> {
            try {
                if (titleField.getText().trim().isEmpty() || descField.getText().trim().isEmpty()) {
                    JOptionPane.showMessageDialog(this, "Lütfen başlık ve açıklama alanlarını doldurun.", 
                        "Eksik Bilgi", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                taskManager.addTask(titleField.getText(), descField.getText(), 
                        Integer.parseInt(pointsField.getText()), 
                        (TaskType) typeCombo.getSelectedItem(), assignedField.getText());
                refreshAllTables();
                titleField.setText("");
                descField.setText("");
                pointsField.setText("");
                assignedField.setText("ali");
                JOptionPane.showMessageDialog(this, "✅ Okul görevi başarıyla eklendi!", 
                    "Başarılı", JOptionPane.INFORMATION_MESSAGE);
            } catch (NumberFormatException ex) { 
                JOptionPane.showMessageDialog(this, "❌ Hata: Puan sayı olmalı.", 
                    "Hata", JOptionPane.ERROR_MESSAGE); 
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "❌ Hata: " + ex.getMessage(), 
                    "Hata", JOptionPane.ERROR_MESSAGE);
            }
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
            String taskTitle = (String) model.getValueAt(selectedRow, 1);
            
            // --- HATA BURADAYDI, DÜZELTİLDİ ---
            // Tablodan gelen nesneyi direkt String'e cast etmek yerine .toString() kullanıyoruz.
            // Çünkü tablo içinde bu veri TaskStatus(Enum) olarak duruyor.
            String status = model.getValueAt(selectedRow, 6).toString();
            
            if(status.equals("COMPLETED")) {
                String ratingStr = JOptionPane.showInputDialog(this, 
                    "Görev: " + taskTitle + "\n\nLütfen görevin kalitesi için 1-5 arası bir puan verin:",
                    "Görev Değerlendirmesi", JOptionPane.QUESTION_MESSAGE);
                if(ratingStr != null && !ratingStr.trim().isEmpty()) {
                    try {
                        int rating = Integer.parseInt(ratingStr.trim());
                        // 1-5 arası kontrolü
                        if (rating < 1 || rating > 5) {
                            JOptionPane.showMessageDialog(this, 
                                "⚠️ Lütfen 1 ile 5 arasında bir puan verin.", 
                                "Geçersiz Puan", JOptionPane.WARNING_MESSAGE);
                            return;
                        }
                        
                        taskManager.approveTask(taskId, rating);
                        refreshAllTables();
                        JOptionPane.showMessageDialog(this, 
                            "✅ Görev başarıyla onaylandı!\n\n" +
                            "Görev: " + taskTitle + "\n" +
                            "Verilen Puan: " + rating + "/5",
                            "Onaylandı", JOptionPane.INFORMATION_MESSAGE);
                    } catch(Exception ex) { 
                        JOptionPane.showMessageDialog(this, 
                            "❌ Geçersiz puan. Lütfen sadece sayı giriniz.", 
                            "Hata", JOptionPane.ERROR_MESSAGE); 
                    }
                }
            } else {
                JOptionPane.showMessageDialog(this, 
                    "⚠️ Sadece 'COMPLETED' (Tamamlanmış) görevler onaylanabilir.\n\n" +
                    "Seçili görevin durumu: " + status + "\n" +
                    "Lütfen önce çocuğun görevi tamamlamasını bekleyin.",
                    "Uyarı", JOptionPane.WARNING_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(this, 
                "⚠️ Lütfen tablodan bir görev seçin.", 
                "Uyarı", JOptionPane.WARNING_MESSAGE);
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
            childPointsLabel.setText("  ⭐ Merhaba " + currentUser.getUsername().toUpperCase() + 
                "! Toplam Puanın: " + currentUser.getTotalPoints() + " 🎉");
            
            for (Task t : allTasks) {
                // Sadece çocuğa ait görevleri göster
                if (t.getAssignedTo().equals(currentUser.getUsername())) {
                    childTableModel.addRow(new Object[]{
                        t.getId(), t.getTitle(), t.getDescription(), t.getPoints(), t.getStatus()
                    });
                }
            }
            
            // Wish panelini güncelle
            refreshWishPanel();
        }
    }
    
    // Wish panelini güncelle
    private void refreshWishPanel() {
        if (childWishPanel == null) return;
        
        childWishPanel.removeAll();
        User currentUser = taskManager.getCurrentUser();
        
        if (currentUser != null && currentUser.getRole() == UserRole.CHILD) {
            List<Wish> availableWishes = taskManager.getAvailableWishesForUser(currentUser.getUsername());
            
            if (availableWishes.isEmpty()) {
                JLabel noWishLabel = new JLabel("Henüz yapabileceğin hayal yok.");
                noWishLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
                noWishLabel.setForeground(new Color(150, 150, 150));
                noWishLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
                childWishPanel.add(noWishLabel);
                childWishPanel.add(Box.createVerticalStrut(10));
            } else {
                for (Wish wish : availableWishes) {
                    JPanel wishItemPanel = new JPanel(new BorderLayout());
                    wishItemPanel.setBackground(CARD_BACKGROUND);
                    wishItemPanel.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(new Color(200, 210, 220), 1),
                        BorderFactory.createEmptyBorder(10, 10, 10, 10)
                    ));
                    wishItemPanel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 100));
                    
                    // Wish bilgileri
                    JPanel infoPanel = new JPanel();
                    infoPanel.setLayout(new BoxLayout(infoPanel, BoxLayout.Y_AXIS));
                    infoPanel.setBackground(CARD_BACKGROUND);
                    
                    JLabel wishNameLabel = new JLabel(wish.getName());
                    wishNameLabel.setFont(new Font("Segoe UI", Font.BOLD, 14));
                    wishNameLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
                    
                    JLabel wishCostLabel = new JLabel("💰 " + wish.getCost() + " Puan");
                    wishCostLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
                    wishCostLabel.setForeground(new Color(100, 100, 100));
                    wishCostLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
                    
                    infoPanel.add(wishNameLabel);
                    infoPanel.add(Box.createVerticalStrut(5));
                    infoPanel.add(wishCostLabel);
                    
                    // Satın Al butonu
                    JButton purchaseBtn = createStyledButton("Yap", 
                        new Color(255, 140, 0), new Color(255, 165, 0), 100, 35);
                    purchaseBtn.setFont(new Font("Segoe UI", Font.BOLD, 12));
                    purchaseBtn.addActionListener(e -> {
                        if (taskManager.purchaseWish(wish.getName(), currentUser.getUsername())) {
                            refreshAllTables();
                            JOptionPane.showMessageDialog(this, 
                                "🎉 Tebrikler!\n\n'" + wish.getName() + "' hayalini yaptın!\n\n" +
                                "Kalan Puanın: " + taskManager.getCurrentUser().getTotalPoints(),
                                "Yapıldı", JOptionPane.INFORMATION_MESSAGE);
                        } else {
                            JOptionPane.showMessageDialog(this, 
                                "❌ Yetersiz puan veya hata oluştu!", 
                                "Hata", JOptionPane.ERROR_MESSAGE);
                        }
                    });
                    
                    wishItemPanel.add(infoPanel, BorderLayout.CENTER);
                    wishItemPanel.add(purchaseBtn, BorderLayout.EAST);
                    
                    childWishPanel.add(wishItemPanel);
                    childWishPanel.add(Box.createVerticalStrut(10));
                }
            }
        }
        
        childWishPanel.revalidate();
        childWishPanel.repaint();
    }

    // Uygulamayı Başlatan Main
    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception ignored) {}
        SwingUtilities.invokeLater(() -> new MainFrame().setVisible(true));
    }
}