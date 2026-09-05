package com.example.budgeting.domain;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class Transaction {
    private TransactionId id;
    private String description;
    private long amount;
    private Category category;
    private LocalDateTime createdAt;

    public Transaction(
            String description,
            long amount,
            Category category
    ) {
        this.id = new TransactionId();
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.createdAt = LocalDateTime.now();
    }

    public Transaction(
            TransactionId id,
            String description,
            long amount,
            Category category
    ) {
        this(
                id,
                description,
                amount,
                category,
                null
        );
    }

    public Transaction(
            TransactionId id,
            String description,
            long amount,
            Category category,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.createdAt = createdAt;
    }
}