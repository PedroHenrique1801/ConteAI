package com.example.budgeting.domain;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository {

    Transaction save(Transaction transaction);

    List<Transaction> findAllByCategory(Category category);

    List<Transaction> findAllOrderByCreatedAtDesc();

    Long sumAmountByCategory(Category category);

    Optional<Transaction> findLatest();
}