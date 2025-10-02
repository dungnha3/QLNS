package QuanLy.QLNS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class QlnsApplication {

	public static void main(String[] args) {
		SpringApplication.run(QlnsApplication.class, args);
	}
	
	@GetMapping("/")
	public String home() {
		return "QLNS Application is running!";
	}
	
	@GetMapping("/api/test")
	public String test() {
		return "API is working!";
	}
}
