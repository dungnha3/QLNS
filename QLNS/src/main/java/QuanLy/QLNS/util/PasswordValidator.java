package QuanLy.QLNS.util;

import java.util.regex.Pattern;

public class PasswordValidator {
    
    // Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
    private static final String PASSWORD_PATTERN = 
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    
    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);
    
    public static boolean isValid(String password) {
        return pattern.matcher(password).matches();
    }
    
    public static String getPasswordRequirements() {
        return "Mật khẩu phải có ít nhất 8 ký tự, bao gồm: " +
               "chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)";
    }
    
    public static boolean isCommonPassword(String password) {
        String[] commonPasswords = {
            "password", "123456", "123456789", "12345678", "12345",
            "1234567", "admin", "password123", "admin123", "qwerty",
            "abc123", "Password1", "welcome", "monkey", "dragon"
        };
        
        String lowerPassword = password.toLowerCase();
        for (String common : commonPasswords) {
            if (lowerPassword.equals(common.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    
    public static String validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            return "Mật khẩu không được để trống";
        }
        
        if (password.length() < 8) {
            return "Mật khẩu phải có ít nhất 8 ký tự";
        }
        
        if (password.length() > 128) {
            return "Mật khẩu không được quá 128 ký tự";
        }
        
        if (isCommonPassword(password)) {
            return "Mật khẩu quá phổ biến, vui lòng chọn mật khẩu khác";
        }
        
        if (!isValid(password)) {
            return getPasswordRequirements();
        }
        
        return null; // Mật khẩu hợp lệ
    }
}

