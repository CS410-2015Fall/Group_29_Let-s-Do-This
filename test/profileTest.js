// Testing user profile

describe("testing stranger profile", function() {
    
    beforeEach(function() {
        it("should have things that exist", function() {
            expect($('#editButton')).toExist();
        })
        
        it("should not have any buttons in view", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        })
        
        it("should not have anything in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        })
        
        var view = readFixtures("profilefixture.html");
        $('body').append(view);
    
        var username = "MrPeanutbutter";
        loadStrangerData(username);
    })

    
    it("should have friend button visible", function() {
        expect($('#editButton')).toBeHidden();
        expect($('#friendButton')).toBeVisible();
        expect($('#unfriendButton')).toBeHidden();        
    })
    
    it("should have things in mainContent", function() {
        expect($('#mainContent')).not.toBeEmpty();
    })
    
    afterEach(function(){
        clearProfile();
        it("should have things that exist still", function() {
            expect($('#editButton')).toExist();
        })
        
        it("should not have any buttons in view anymore", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        })
        
        it("should not have anything anymore in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        })
    })
    
})