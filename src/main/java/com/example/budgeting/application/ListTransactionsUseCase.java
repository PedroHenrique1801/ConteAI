package com.example.budgeting.application;

import com.example.budgeting.application.output.TransactionOutput;
import com.example.budgeting.domain.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListTransactionsUseCase {
    private final TransactionRepository transactionRepository;

    public ListTransactionsUseCase(
            TransactionRepository transactionRepository
    ) {
        this.transactionRepository = transactionRepository;
    }

    public List<TransactionOutput> execute() {
        return transactionRepository
                .findAllOrderByCreatedAtDesc()
                .stream()
                .map(TransactionOutput::from)
                .toList();
    }
}