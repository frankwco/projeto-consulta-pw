package br.com.nexuserp.dto.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        @NotBlank @Size(min = 2, max = 140) String name,
        @NotBlank @Email String email,
        @Size(max = 30) String phone,
        @Size(max = 30) String document,
        @Size(max = 300) String address
) {}
