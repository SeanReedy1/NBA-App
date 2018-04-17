const STATE = { results: [], savedPlayers:[] }

function hideSavedSection(){
  $(".saved-players").hide();
}

function getDataFromApi(searchTerm, callback) {
$.ajax
({
  type: "GET",
  url: "https://api.mysportsfeeds.com/v1.2/pull/nba/2016-2017-regular/cumulative_player_stats.json",
  dataType: 'json',
  async: false,
  data: {player:searchTerm},
  headers: {
    "Authorization": "Basic " + btoa("SeanReedy:Jordan23")
    
  },
  success: function (data){
    
    callback(data);
  }
});




}

function watchSubmit(){
  $(".js-search-SportsFeeds").submit(function(event){
    event.preventDefault();
   if($('#first-name').val()&&$('#last-name').val()){
    showSearchResults()
    getDataFromApi($('#first-name').val()+"-"+$('#last-name').val(), displaySportsFeedsSearchData);
    }
    else if($('#last-name').val()) {
      showSearchResults()
      getDataFromApi($('#last-name').val(), displaySportsFeedsSearchData)
      
    }
    else {
      alert("Please enter first and last name")
    }
  
})
}

function hideSearchResults(){
  $(".js-search-results").hide();
}

function showSearchResults(){
  $(".js-search-results").show();
}

function homeToSave(){
  $(".display-saved-players").click(function(){
    $(".search-players").hide();
    $(".saved-players").show();
  })
}



function displaySportsFeedsSearchData(data){
  
  STATE.results = data.cumulativeplayerstats.playerstatsentry;
  console.log(data)
  if(!STATE.results) {
    alert("Sorry, no players found")
  }
  else { 
  
  const results=data.cumulativeplayerstats.playerstatsentry.map(function(player, index) {
    return renderResult(player);
  });
  
  $(".js-search-results").empty();
  $(".js-search-results").append("<h1>Search Results</h1>")
  $(".js-search-results").append(results);
  }
}

function renderResult(player){
  
  return `
    <div class="player">
    ${ player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }

    <p>${player.player.FirstName} ${player.player.LastName}</p>
  <p>${player.team.City} ${player.team.Name}</p>
  <p>Number ${player.player.JerseyNumber}</p>
  <p>Position: ${player.player.Position}</p>
 
<button type="button" class="save"  data-player-id="${player.player.ID}">Select</button>
</div>
    
  </div>  
  `
 
}


function savePlayer(){
  $(".js-search-results").on("click", ".save", function(event){
   const clickedId = $(this).data('playerId');
   
  // for(i=0; i<STATE.savedPlayers.length; i++) {
  //   if($(this).data('playerId')===STATE.savedPlayers[i].player.ID) {
  //   alert("Player already selected")
  // }
  // }
   
   
   const playerToBeSaved = STATE.results.find(item => {
     return item.player.ID === `${clickedId}`;
   })
   
  
    STATE.savedPlayers.push(playerToBeSaved);  
    
  displaySavedPlayers(STATE);
   
})
}

function backToSearch(){
  $(".saved-players").on('click', '.back-to-search', function(){
     $(".saved-players").hide();
     $(".search-players").show();
     $(".player").remove();
     $(hideSearchResults)
  })
}

function renderSavedPlayers(savedPlayer){
  
  $(".saved-players").append(
     `
     
     
     <div class="saved-player">
     ${ savedPlayer.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${savedPlayer.player.LastName}/${savedPlayer.player.FirstName}" />`: "" }
     <p>${savedPlayer.player.FirstName} ${savedPlayer.player.LastName}</p>
     <p>${savedPlayer.team.City} ${savedPlayer.team.Name}
     <p>Number ${savedPlayer.player.JerseyNumber}</p>
     <p>Position: ${savedPlayer.player.Position}</p>
     
  
     `
    )
}

function displaySavedPlayers(data){
  $(".saved-players").empty();
   $(".saved-players").append("<h1>Saved Players</h1> <button class='back-to-search'>Back to search</button> <button class='comparePoints'> Compare Points</button> <button class=compare-rebounds>Compare Rebounds</button><button class='compare-assists'>Compare Assists</button>")
  data.savedPlayers.map(function(savedPlayer, index){
    
    return renderSavedPlayers(savedPlayer);
    
  })
  $(".search-players").hide();
  $(".saved-players").show();
}

function comparePoints(){
  $(".saved-players").on('click', '.comparePoints', function(){
    
    
    
    STATE.savedPlayers.sort(function(a,b) {
      return parseFloat(b.stats.Pts['#text'])-(a.stats.Pts['#text']);
    })
    
    $(".saved-players").empty();
    $(".saved-players").append("<h1>Players sorted by points scored</h1> <button class='back-from-points'>Back to Search</button>")
    STATE.savedPlayers.forEach(function(player, index) {
       renderPointsScored(player, index);
    });
    
    STATE.savedPlayers=[];
  
    
  })
}

function renderPointsScored(player, index){
  $(".saved-players").append(
  `
  <div class="player">
  ${ player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }
  <p>Rank: ${index+1}</p>
  <p>${player.player.FirstName} ${player.player.LastName}</p>
  <p>${player.team.City} ${player.team.Name}</p>
  <p class="highlight">Points: ${player.stats.Pts['#text']}</p>
 </div>
 `
 )
}

function backFromPoints(){
  $(".saved-players").on('click', '.back-from-points', function(){
     $(".saved-players").hide();
     $(".search-players").show();
     $(".player").remove();
     $(hideSearchResults)
  })
}

function compareRebounds(){
  $(".saved-players").on('click', '.compare-rebounds', function(){
    
   
    
    STATE.savedPlayers.sort(function(a,b) {
      return parseFloat(b.stats.Reb['#text'])-(a.stats.Reb['#text']);
    })
    
     $(".saved-players").empty();
     $(".saved-players").append("<h1>Players sorted by rebounds collected</h1> <button class='back-from-rebounds'>Back to Search</button>")
    
    let reboundsSorted=STATE.savedPlayers.map(function(player, index) {
      return renderRebounds(player, index);
    });
   
   STATE.savedPlayers=[];
   
  })
}

function renderRebounds(player, index){
  $(".saved-players").append( `
  <div class="player">
  ${ player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }
  <p>Rank: ${index+1}</p>
  <p>${player.player.FirstName} ${player.player.LastName}</p>
<p>${player.team.City} ${player.team.Name}</p>
 <p class="highlight">Rebounds: ${player.stats.Reb['#text']}</p>
 </div>
 `
 )
}

function backFromRebounds(){
  $(".saved-players").on('click', '.back-from-rebounds', function(){
     $(".saved-players").hide();
     $(".search-players").show();
     $(".player").remove();
     $(hideSearchResults)
  })
}

function compareAssists(){
  $(".saved-players").on('click', '.compare-assists', function(){
    
    
    
    STATE.savedPlayers.sort(function(a,b) {
      return parseFloat(b.stats.Ast['#text'])-(a.stats.Ast['#text']);
    })
    
     $(".saved-players").empty();
     $(".saved-players").append("<h1>Players sorted by assists dished</h1> <button class='back-from-assists'>Back to Search</button>")
    
    let reboundsSorted=STATE.savedPlayers.map(function(player, index) {
      return renderAssists(player, index);
    });
   
   STATE.savedPlayers=[];
   
  })
}

function renderAssists(player, index){
  $(".saved-players").append( `
  <div class="player">
  ${ player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }
  <p>Rank: ${index+1}</p>
  <p>${player.player.FirstName} ${player.player.LastName}</p>
<p>${player.team.City} ${player.team.Name}</p>
 <p class="highlight">Assists: ${player.stats.Ast['#text']}</p>
 </div>
 `
 )
}

function backFromAssists(){
  $(".saved-players").on('click', '.back-from-assists', function(){
     $(".saved-players").hide();
     $(".search-players").show();
     $(".player").remove();
  })
}





$(watchSubmit);
$(savePlayer);
$(hideSavedSection)
$(backToSearch)
$(backFromPoints)
$(backFromRebounds)
$(backFromRebounds)
$(backFromAssists)
$(comparePoints)
$(compareRebounds)
$(compareAssists)
$(hideSearchResults)
$(homeToSave)
$(hideSearchResults)