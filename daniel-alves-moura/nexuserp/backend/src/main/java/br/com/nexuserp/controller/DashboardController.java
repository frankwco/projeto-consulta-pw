package br.com.nexuserp.controller;

import br.com.nexuserp.dto.dashboard.DashboardResponse;
import br.com.nexuserp.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService service;
    public DashboardController(DashboardService service) { this.service = service; }
    @GetMapping public DashboardResponse get() { return service.get(); }
}
