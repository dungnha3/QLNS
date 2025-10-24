package QuanLy.QLNS.exception;

/**
 * Exception cho authentication/authorization errors (401/403)
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
