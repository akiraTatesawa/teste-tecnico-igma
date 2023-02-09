Feature: Customer Registration
    Customers can only be registered if their cpf, name and birthday are valid

    Background:
        Given a Customer with a cpf, name and birthday
        And a valid Name is composed by only letters with a 60 char max
        And a valid Birthday has the format 'DD/MM/YYYY'
        And a valid cpf has the formats '999.999.999-00' and '99999999900'

    Scenario: Customer is registered successfully
        Given the Customer provides a valid cpf, name and birthday
        And the Customer provides a valid name
        And the Customer provides a valid birthday
        And the provided cpf is not being used
        When the system tries to register the Customer
        Then the Customer will be registered
    
    Scenario: Customer tries to be registered with an invalid cpf, and fails
        Given the Customer provides an invalid cpf format
        When the system tries to register the Customer
        Then the Customer should see "The provided CPF is invalid"
    
    Scenario: Customer tries to be registered with an invalid name, and fails
        Given the Customer provides a valid cpf
        But the Customer provides an invalid name
        When the system tries to register the Customer
        Then the Customer should see "The provided Name is invalid"

    Scenario: Customer tries to be registered with an invalid birthday, and fails
        Given the Customer provides a valid cpf
        And the Customer provides a valid name
        But the Customer provides an invalid birthday
        When the system tries to register the Customer
        Then the Customer should see "The provided Birthday is invalid"
    
    Scenario: Customer tries to be registered with a cpf that is already taken, and fails
        Given the Customer provides a valid cpf
        And the Customer provides a valid name
        And the Customer provides a valid birthday
        But the provided cpf is already being used
        When the system tries to register the Customer
        Then the Customer should see "The provided CPF is already being used"