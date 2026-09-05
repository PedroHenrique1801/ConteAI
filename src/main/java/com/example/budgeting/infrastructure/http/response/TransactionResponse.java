package com.example.budgeting.infrastructure.http.response;

import com.example.budgeting.application.output.TransactionOutput;

import java.time.LocalDateTime;

public record TransactionResponse(
        String id,
        String category,
        String description,
        double amount,
        LocalDateTime createdAt
) {

    public static TransactionResponse from(
            TransactionOutput output
    ) {
        return new TransactionResponse(
                output.id(),
                output.category(),
                output.description(),
                output.value(),
                output.createdAt()
        );
    }
}