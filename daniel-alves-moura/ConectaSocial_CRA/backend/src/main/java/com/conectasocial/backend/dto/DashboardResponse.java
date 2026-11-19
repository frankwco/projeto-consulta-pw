package com.conectasocial.backend.dto;

public record DashboardResponse(
    long users,
    long posts,
    long comments,
    long likes,
    long follows
) {}
