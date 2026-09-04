package com.example.budgeting.application;

import com.example.budgeting.application.output.TransactionOutput;
import com.example.budgeting.domain.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GetLatestTransactionUseCase {
    private final TransactionRepository transactionRepository;

    public GetLatestTransactionUseCase(
            TransactionRepository transactionRepository
    ) {
        this.transactionRepository = transactionRepository;
    }

    public Optional<TransactionOutput> execute() {
        return transactionRepository
                .findLatest()
                .map(TransactionOutput::from);
    }
}