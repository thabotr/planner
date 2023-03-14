describe("Plan Page Fetch Tests", () => {
    it('can fetch issues from github and add them as unscheduled tasks', () => {
        cy.visit('/plan');
        cy.get("[aria-label='unscheduled tasks']").children("[aria-label^='task']").should('not.exist');
        cy.get("#fetch-from-git").click();
        cy.get("[aria-label='unscheduled tasks']").children("[aria-label^='task']");
    })
})