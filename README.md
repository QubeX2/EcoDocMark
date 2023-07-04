# EcoDocMark
### Global settings
```
.currency-suffix: kr
.currency-prefix: $
```

### Text modifiers
```
#Text_ - Bold text
+(A,B,C)_ - Bold numbers
%2023-09-09_ - Bold date
```

### Symbol's and Item's
##### Create an *ITEM* value and description stored in symbol "S"
```
:SYMBOL =VAL 'DESC %DATE

:S 'Salary =25000
:A1 'Debt =35000
:E 'Expense candy =250 %2023-06-09
``` 

### Lists
##### Create a list of *ITEM*'s
```
:SYMBOL 'TITLE { HEADERS, ITEM's, FUNCTIONS, SORT } SORT<|> - 

:X 'Expenses_ {
  ['HEADER1 'HEADER2 'HEADER3]
  =2000 'Gasoline %2023-07-11
  =5500 'Rent
  =1200 'Loan
  [!ADD(X)],
  >#
}

=> (Sort by VAL, asc)
#> (Sort by DESC, asc)
%< (Sort by DATE, desc)

Y: 'Loans{ 3000 kr 'Bank1, 4000 kr 'Bank2, ># }

Individual items can be accessed with X.1, X.2 etc
```

### Functions
###### Addition
```
!ADD(...SYMBOL's)

!ADD(X) - sum a list of items
!ADD(X,Y) - sum two lists together
!ADD(X, S) - sum a list of items, plus one symbol
```

###### Subtraction
```
!SUB(...SYMBOL's)

!SUB( +(X), S) - Sum the list X and subtract S
```

###### Multiplication
```
!MUL(...SYMBOL's)

!MUL(X) - Multiply values in list
```

###### Division
```
!DIV(...SYMBOL's)
```

### Examples
```
.currency-suffix: kr

:I 'Income_ {
  ['Type 'Amount]
  'Income =25500
  'Pension =3650
  !SUM(I)
}

:E 'Expenses_ {
  ['Type 'Amount]
  'Personal Trainer =1600
  'Rent =4500
  'Car Loan =1900
  'Monthly !SUM(M)
  !SUM(E)
}

:S 'Saldo_ !SUB(!ADD(I),!ADD(E))_

@Montly Expenses
:M 'Monthly_ {
  ['Type 'Amount]
  'Netflix =99
  'Google =170
  'Amazon Prime =65
  !SUM(M)
}

```
