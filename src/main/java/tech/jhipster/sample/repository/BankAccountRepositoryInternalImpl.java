package tech.jhipster.sample.repository;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.UUID;
import java.util.function.BiFunction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.sample.domain.BankAccount;
import tech.jhipster.sample.domain.enumeration.BankAccountType;
import tech.jhipster.sample.repository.rowmapper.BankAccountRowMapper;
import tech.jhipster.sample.repository.rowmapper.UserRowMapper;
import tech.jhipster.sample.service.EntityManager;

/**
 * Spring Data SQL reactive custom repository implementation for the BankAccount entity.
 */
@SuppressWarnings("unused")
class BankAccountRepositoryInternalImpl implements BankAccountRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final UserRowMapper userMapper;
    private final BankAccountRowMapper bankaccountMapper;

    private static final Table entityTable = Table.aliased("bank_account", EntityManager.ENTITY_ALIAS);
    private static final Table userTable = Table.aliased("jhi_user", "e_user");

    public BankAccountRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        UserRowMapper userMapper,
        BankAccountRowMapper bankaccountMapper
    ) {
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.userMapper = userMapper;
        this.bankaccountMapper = bankaccountMapper;
    }

    @Override
    public Flux<BankAccount> findAllBy(Pageable pageable) {
        return findAllBy(pageable, null);
    }

    @Override
    public Flux<BankAccount> findAllBy(Pageable pageable, Criteria criteria) {
        return createQuery(pageable, criteria).all();
    }

    RowsFetchSpec<BankAccount> createQuery(Pageable pageable, Criteria criteria) {
        List<Expression> columns = BankAccountSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(UserSqlHelper.getColumns(userTable, "user"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(userTable)
            .on(Column.create("user_id", entityTable))
            .equals(Column.create("id", userTable));

        String select = entityManager.createSelect(selectFrom, BankAccount.class, pageable, criteria);
        String alias = entityTable.getReferenceName().getReference();
        String selectWhere = Optional
            .ofNullable(criteria)
            .map(
                crit ->
                    new StringBuilder(select)
                        .append(" ")
                        .append("WHERE")
                        .append(" ")
                        .append(alias)
                        .append(".")
                        .append(crit.toString())
                        .toString()
            )
            .orElse(select); // TODO remove once https://github.com/spring-projects/spring-data-jdbc/issues/907 will be fixed
        return db.sql(selectWhere).map(this::process);
    }

    @Override
    public Flux<BankAccount> findAll() {
        return findAllBy(null, null);
    }

    @Override
    public Mono<BankAccount> findById(Long id) {
        return createQuery(null, where("id").is(id)).one();
    }

    private BankAccount process(Row row, RowMetadata metadata) {
        BankAccount entity = bankaccountMapper.apply(row, "e");
        entity.setUser(userMapper.apply(row, "user"));
        return entity;
    }

    @Override
    public <S extends BankAccount> Mono<S> insert(S entity) {
        return entityManager.insert(entity);
    }

    @Override
    public <S extends BankAccount> Mono<S> save(S entity) {
        if (entity.getId() == null) {
            return insert(entity);
        } else {
            return update(entity)
                .map(
                    numberOfUpdates -> {
                        if (numberOfUpdates.intValue() <= 0) {
                            throw new IllegalStateException("Unable to update BankAccount with id = " + entity.getId());
                        }
                        return entity;
                    }
                );
        }
    }

    @Override
    public Mono<Integer> update(BankAccount entity) {
        //fixme is this the proper way?
        return r2dbcEntityTemplate.update(entity).thenReturn(1);
    }
}

class BankAccountSqlHelper {

    static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("name", table, columnPrefix + "_name"));
        columns.add(Column.aliased("guid", table, columnPrefix + "_guid"));
        columns.add(Column.aliased("bank_number", table, columnPrefix + "_bank_number"));
        columns.add(Column.aliased("agency_number", table, columnPrefix + "_agency_number"));
        columns.add(Column.aliased("last_operation_duration", table, columnPrefix + "_last_operation_duration"));
        columns.add(Column.aliased("mean_operation_duration", table, columnPrefix + "_mean_operation_duration"));
        columns.add(Column.aliased("mean_queue_duration", table, columnPrefix + "_mean_queue_duration"));
        columns.add(Column.aliased("balance", table, columnPrefix + "_balance"));
        columns.add(Column.aliased("opening_day", table, columnPrefix + "_opening_day"));
        columns.add(Column.aliased("last_operation_date", table, columnPrefix + "_last_operation_date"));
        columns.add(Column.aliased("active", table, columnPrefix + "_active"));
        columns.add(Column.aliased("account_type", table, columnPrefix + "_account_type"));
        columns.add(Column.aliased("attachment", table, columnPrefix + "_attachment"));
        columns.add(Column.aliased("attachment_content_type", table, columnPrefix + "_attachment_content_type"));
        columns.add(Column.aliased("description", table, columnPrefix + "_description"));

        columns.add(Column.aliased("user_id", table, columnPrefix + "_user_id"));
        return columns;
    }
}
