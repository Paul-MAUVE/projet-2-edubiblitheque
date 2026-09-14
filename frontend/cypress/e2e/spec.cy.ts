const visitAsAuthenticatedUser = (path: string) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', 'fake-jwt-token')
    }
  })
}

describe('Registration', () => {
  it('displays the registration form', () => {
    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: {}
    }).as('register')
    cy.visit('/register')

    cy.contains('Registration Form').should('be.visible')
    cy.get('input[formControlName="firstName"]').should('be.visible')
    cy.get('input[formControlName="lastName"]').should('be.visible')
    cy.get('input[formControlName="login"]').should('be.visible')
    cy.get('input[formControlName="password"]').should('be.visible')

    cy.get('input[formControlName="firstName"]').type('Jean')
    cy.get('input[formControlName="lastName"]').type('Louche')
    cy.get('input[formControlName="login"]').type('jean.louche')
    cy.get('input[formControlName="password"]').type('password123')

    cy.get('button').contains('Register').click()
    cy.wait('@register').its('request.body').should('deep.equal', {
      firstName: 'Jean',
      lastName: 'Louche',
      login: 'jean.louche',
      password: 'password123'
    })

    cy.url().should('include', '/login')
  })
})

describe('Login', () => {
  it('displays the login form', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: 'fake-jwt-token'
    }).as('login')
    cy.visit('/login')

    cy.contains('Login Form').should('be.visible')

    cy.get('input[formControlName="login"]').should('be.visible')
    cy.get('input[formControlName="password"]').should('be.visible')

    cy.get('input[formControlName="login"]').type('jean.louche')
    cy.get('input[formControlName="password"]').type('password123')

    cy.get('button').contains('Login').click()
    cy.wait('@login').its('request.body').should('deep.equal', {
      login: 'jean.louche',
      password: 'password123'
    })
    
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.equal('fake-jwt-token'); 
    });

    cy.contains('Connexion réussie !').should('be.visible')

  })

})

describe('Students', () => {
  it('displays the list of students', () => {
    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstName: 'Jean',
          lastName: 'Lache'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Foster'
        }
      ]
    }).as('students')
    visitAsAuthenticatedUser('/students')

    cy.contains('Jean Lache').should('be.visible')
    cy.contains('Jane Foster').should('be.visible')
  })

})

describe('Student-detail', () => {
  it('displays the detail of a student', () => {
    cy.intercept('GET', '/api/students/'+1, {
      statusCode: 200,
      body:
        {
          id: 1,
          firstName: 'Jean',
          lastName: 'Lache'
        }
    }).as('students-detail')
    visitAsAuthenticatedUser('/students/'+1)

    cy.contains('Prénom : Jean').should('be.visible')
    cy.contains('Nom : Lache').should('be.visible')
  })

})

describe('Student-create', () => {
  it('displays the creation of a student', () => {
    cy.intercept('POST', '/api/students', {
      statusCode: 201,
      body: {}
    }).as('students-create')
    visitAsAuthenticatedUser('/students/create')

    cy.get('input[formControlName="firstName"]').type('Iron')
    cy.get('input[formControlName="lastName"]').type('Man')

    cy.get('button').contains('Add').click()
    cy.wait('@students-create').its('request.body').should('deep.equal', {
      firstName: 'Iron',
      lastName: 'Man',
    })

    cy.contains('Étudiant créé avec succès !').should('be.visible')
  })

})

describe('Student-update', () => {
  it('displays the update of a student', () => {
    cy.intercept('GET', '/api/students/'+1, {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Jean',
        lastName: 'Lache'
      }
    }).as('students-detail')
    cy.intercept('PUT', '/api/students/'+1, {
      statusCode: 200,
      body: {}
    }).as('students-update')
    visitAsAuthenticatedUser('/students/'+1)

    cy.get('a').contains('Modifier').click()

    cy.wait('@students-detail')

    cy.url().should('include', '/students/'+1+'/edit')

    cy.get('input[formControlName="firstName"]').should('have.value', 'Jean')
    cy.get('input[formControlName="lastName"]').should('have.value', 'Lache')

    cy.get('input[formControlName="firstName"]').clear().type('Jean')
    cy.get('input[formControlName="lastName"]').clear().type('Louche')

    cy.get('button').contains('Save').click()
    cy.wait('@students-update').its('request.body').should('deep.equal', {
      id: 1,
      firstName: 'Jean',
      lastName: 'Louche',
    })

    cy.contains('Étudiant modifié avec succès !').should('be.visible')
  })

})

describe('Student-delete', () => {
  it('displays the delete of a student', () => {
    cy.intercept('GET', '/api/students', {
          statusCode: 200,
          body: [
            {
              id: 1,
              firstName: 'Jean',
              lastName: 'Louche'
            },
            {
              id: 3,
              firstName: 'Iron',
              lastName: 'Man'
            }
          ]
    }).as('students')
    cy.intercept('GET', '/api/students/'+2, {
      statusCode: 200,
      body:
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Foster'
        }
    }).as('students-detail')
    cy.intercept('DELETE', '/api/students/'+2, {
      statusCode: 200,
      body: {}
    }).as('students-delete')
    visitAsAuthenticatedUser('/students/'+2)

    cy.contains('Prénom : Jane').should('be.visible')
    cy.contains('Nom : Foster').should('be.visible')

    cy.on('window:confirm', () => true)

    cy.get('a').contains('Supprimer').click()
  
    cy.wait('@students-delete')
    
    cy.url().should('include', '/students')
    
  })

})
