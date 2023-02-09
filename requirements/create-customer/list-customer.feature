Feature: List Customer by CPF

    Background: 
        Given an Admin using the system
        And the Admin is trying to get a Customer by providing its cpf
        And a valid cpf has the formats '999.999.999-00' and '99999999900'

    Scenario: Customer is listed successfully
        Given the Admin provides a valid cpf
        And the cpf provided belongs to a Customer
        When the Admin tries to list the Customer
        Then the Admin should see the Customer data
    
    Scenario: Admin tries to list a customer with an invalid cpf, and fails
        Given the Admin provides an invalid cpf
        When the Admin tries to list the Customer
        Then the Admin should see a message informing that the cpf is invalid
    
    Scenario: Admin tries to list a customer with a cpf that is not registered, and fails
        Given the Admin provides a valid cpf
        But the cpf provided does not belong to any Customer
        When the Admin tries to list the Customer
        Then the Admin should see "Customer not found"
    
    
    
    
    