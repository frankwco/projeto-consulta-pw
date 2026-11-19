package com.conectasocial.backend.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.conectasocial.backend.dto.DashboardResponse;
import com.conectasocial.backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;
@RestController @SecurityRequirement(name = "bearerAuth") @RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService service; public DashboardController(DashboardService service){this.service=service;}
    @GetMapping public DashboardResponse get(){return service.get();}
}
