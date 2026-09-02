package com.eazybytes.message.dto;

/**
 * DTO (Data Transfer Object) used for serializing/deserializing account-related messages
 * exchanged via RabbitMQ between microservices. It carries account identity and contact
 * details such as the account number, customer name, email, and mobile number.
 *
 * @param accountNumber the unique identifier of the account
 * @param name           the customer's full name
 * @param email          the customer's email address
 * @param mobileNumber   the customer's mobile phone number
 */
public record AccountsMsgDto(Long accountNumber, String name, String email, String mobileNumber) {
}
