-- SQL to seed the Customer table using COPY
TRUNCATE TABLE "Customer" RESTART IDENTITY CASCADE;

COPY "Customer"("id", "userId", "phoneNumber", "createdAt", "updatedAt", "deletedAt")
FROM '/customers.csv'
DELIMITER ','
CSV HEADER
NULL AS '';
