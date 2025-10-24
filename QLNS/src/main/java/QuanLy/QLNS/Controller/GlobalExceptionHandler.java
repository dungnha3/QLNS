package QuanLy.QLNS.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import QuanLy.QLNS.dto.ApiResponse;
import QuanLy.QLNS.exception.BusinessException;
import QuanLy.QLNS.exception.ResourceNotFoundException;
import QuanLy.QLNS.exception.UnauthorizedException;
import QuanLy.QLNS.exception.ValidationException;

import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * Xử lý tất cả exceptions trong ứng dụng và trả về response thống nhất
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	/**
	 * Xử lý validation errors từ @Valid
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
			MethodArgumentNotValidException ex, WebRequest request) {
		log.warn("Validation error at {}: {}", request.getDescription(false), ex.getMessage());
		
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});
		
		return ResponseEntity.badRequest()
				.body(ApiResponse.error("Dữ liệu không hợp lệ", errors));
	}
	
	/**
	 * Xử lý ResourceNotFoundException (404)
	 */
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse<String>> handleResourceNotFoundException(
			ResourceNotFoundException ex, WebRequest request) {
		log.warn("Resource not found at {}: {}", request.getDescription(false), ex.getMessage());
		
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiResponse.error(ex.getMessage()));
	}
	
	/**
	 * Xử lý BusinessException (400)
	 */
	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ApiResponse<String>> handleBusinessException(
			BusinessException ex, WebRequest request) {
		log.warn("Business error at {}: {} [Code: {}]", 
			request.getDescription(false), ex.getMessage(), ex.getErrorCode());
		
		return ResponseEntity.badRequest()
				.body(ApiResponse.error(ex.getMessage()));
	}
	
	/**
	 * Xử lý ValidationException (400)
	 */
	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
			ValidationException ex, WebRequest request) {
		log.warn("Validation error at {}: {}", request.getDescription(false), ex.getMessage());
		
		return ResponseEntity.badRequest()
				.body(ApiResponse.error(ex.getMessage(), ex.getErrors()));
	}
	
	/**
	 * Xử lý UnauthorizedException (401)
	 */
	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ApiResponse<String>> handleUnauthorizedException(
			UnauthorizedException ex, WebRequest request) {
		log.warn("Unauthorized access at {}: {}", request.getDescription(false), ex.getMessage());
		
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(ApiResponse.error(ex.getMessage()));
	}

	/**
	 * Xử lý AccessDeniedException (403)
	 */
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiResponse<String>> handleAccessDeniedException(
			AccessDeniedException ex, WebRequest request) {
		log.warn("Access denied at {}: {}", request.getDescription(false), ex.getMessage());
		
		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(ApiResponse.error("Bạn không có quyền truy cập tài nguyên này"));
	}

	/**
	 * Xử lý IllegalArgumentException (400)
	 */
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(
			IllegalArgumentException ex, WebRequest request) {
		log.warn("Illegal argument at {}: {}", request.getDescription(false), ex.getMessage());
		
		return ResponseEntity.badRequest()
				.body(ApiResponse.error(ex.getMessage()));
	}

	/**
	 * Xử lý RuntimeException (400)
	 */
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ApiResponse<String>> handleRuntimeException(
			RuntimeException ex, WebRequest request) {
		log.error("Runtime error at {}: {}", request.getDescription(false), ex.getMessage(), ex);
		
		return ResponseEntity.badRequest()
				.body(ApiResponse.error(ex.getMessage()));
	}

	/**
	 * Xử lý tất cả exceptions khác (500)
	 */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<String>> handleException(
			Exception ex, WebRequest request) {
		log.error("Internal server error at {}: {}", 
			request.getDescription(false), ex.getMessage(), ex);
		
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ApiResponse.error("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."));
	}
}
