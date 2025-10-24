package QuanLy.QLNS.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * Exception cho validation errors (400)
 */
public class ValidationException extends RuntimeException {
    
    private final Map<String, String> errors;
    
    public ValidationException(String message) {
        super(message);
        this.errors = new HashMap<>();
    }
    
    public ValidationException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }
    
    public ValidationException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = errors;
    }
    
    public Map<String, String> getErrors() {
        return errors;
    }
}
