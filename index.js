STATE = { results: [], savedPlayers:[] }

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

function instructionsOn(){
  $(".instructions").click(function(){
    $(".overlay").css("display", "block");
  })
}

function instructionsOff(){
  $(".overlay-off").click(function(){
    $(".overlay").css("display", "none");
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
  if(STATE.results.length<2){
    return `
    <div class="col-6">
    <section class="player" role="region">
    ${ player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }
    <p>${player.player.FirstName} ${player.player.LastName}</p>
    <p>${player.team.City} ${player.team.Name}</p>
    <p>Number ${player.player.JerseyNumber}</p>
    <p>Position: ${player.player.Position}</p>
 
    <button type="button" class="save"  data-player-id="${player.player.ID}">Select</button>
    </section>
    </div>  
    `
  }
  else{
  return `
    <div class="col-6">
    <section class="player" role="region">
    ${player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }
    <p>${player.player.FirstName} ${player.player.LastName}</p>
    <p>${player.team.City} ${player.team.Name}</p>
    <p>Number ${player.player.JerseyNumber}</p>
    <p>Position: ${player.player.Position}</p>
 
    <button type="button" class="save"  data-player-id="${player.player.ID}">Select</button>
    </section>
    
    </div>  
  `
 }
}


function savePlayer(){
  $(".js-search-results").on("click", ".save", function(event){
   const clickedId = $(this).data('playerId');
   const playerToBeSaved = STATE.results.find(item => {
     return item.player.ID === `${clickedId}`;
   })
   
   if (STATE.savedPlayers.find(p => p.player.ID === playerToBeSaved.player.ID)) {
      alert("Player already selected") 
   } else {
     STATE.savedPlayers.push(playerToBeSaved);  
     displaySavedPlayers(STATE);
   }
   
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
     
     <div class="col-6">
     <div class="saved-player">
     ${ savedPlayer.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${savedPlayer.player.LastName}/${savedPlayer.player.FirstName}" />`: "" }
     <p>${savedPlayer.player.FirstName} ${savedPlayer.player.LastName}</p>
     <p>${savedPlayer.team.City} ${savedPlayer.team.Name}
     <p>Number ${savedPlayer.player.JerseyNumber}</p>
     <p>Position: ${savedPlayer.player.Position}</p>
     </div>
     </div>
     `
    )

}

function savedPlayersClick(){
  $(".display-saved-players").click(function(){
    
  displaySavedPlayers(STATE);
})
}

function removeSavedPlayers(){
  $(".saved-players").on("click", ".remove-players", function(){
    STATE.savedPlayers=[];
    $(".saved-players").empty();
    $(".saved-players").append(
      `
      <div class="display-saved-wrapper">
      <button class='back-to-search'>Back to search</button>
      </div>
      <h1>You have not selected any players yet</h1>
  
      `)
  })
}

function removeFromHome(){
  $(".remove-players").click( function(){
    STATE.savedPlayers=[];
   
  })
}


function displaySavedPlayers(data){
  $(".saved-players").empty();
   $(".saved-players").append(" <h1>Saved Players</h1> <button class='back-to-search'>Back to search</button><button class='remove-players'>Remove Saved Players</button> <button class='comparePoints'> Compare Points Per Game</button> <button class=compare-rebounds>Compare Rebounds Per Game</button><button class='compare-assists'>Compare Assists Per Game</button>")
   if(STATE.savedPlayers.length===0){
    $(".saved-players").append(
      `
      <h1>You have not selected any players yet</h1>
  
      `)
  }
  else{

  data.savedPlayers.forEach(function(savedPlayer, index){
    
  renderSavedPlayers(savedPlayer);
    
  })
  }
  $(".search-players").hide();
  $(".saved-players").show();
}

function comparePoints(){
  $(".saved-players").on('click', '.comparePoints', function(){
    
    
    
    STATE.savedPlayers.sort(function(a,b) {
      return parseFloat(b.stats.PtsPerGame['#text'])-(a.stats.PtsPerGame['#text']);
    })
    
    $(".saved-players").empty();
    $(".saved-players").append("<h1>Players sorted by points per game scored</h1> <div class='row><div class='col-12'><button class='back-from-points'>Back to Search</button></div></div>")
    STATE.savedPlayers.forEach(function(player, index) {
       renderPointsScored(player, index);
    });

  })
}

function renderPointsScored(player, index){
  $(".saved-players").append(
  `
    <div class="col-6">
    <div class="player">
    ${ player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }
    <p class="rank">Rank: ${index+1}</p>
    <p>${player.player.FirstName} ${player.player.LastName}</p>
    <p>${player.team.City} ${player.team.Name}</p>
    <p class="highlight">Points Per Game: ${player.stats.PtsPerGame['#text']}</p>
   </div>
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
      return parseFloat(b.stats.RebPerGame['#text'])-(a.stats.RebPerGame['#text']);
    })
    
     $(".saved-players").empty();
     $(".saved-players").append("<h1>Players sorted by rebounds collected</h1> <div class='row'><div class='col-12'><button class='back-from-rebounds'>Back to Search</button></div></div>")
    
    let reboundsSorted=STATE.savedPlayers.map(function(player, index) {
      return renderRebounds(player, index);
    });

  })
}

function renderRebounds(player, index){
  $(".saved-players").append( `
    <div class="col-6">
    <div class="player">
      ${ player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }
      <p>Rank: ${index+1}</p>
      <p>${player.player.FirstName} ${player.player.LastName}</p>
      <p>${player.team.City} ${player.team.Name}</p>
      <p class="highlight">Rebounds Per Game: ${player.stats.RebPerGame['#text']}</p>
   </div>
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
      return parseFloat(b.stats.AstPerGame['#text'])-(a.stats.AstPerGame['#text']);
    })
    
     $(".saved-players").empty();
     $(".saved-players").append("<h1>Players sorted by assists dished</h1> <div class='row'><div class='col-12'><button class='back-from-assists'>Back to Search</button></div></div>")
    
    let reboundsSorted=STATE.savedPlayers.map(function(player, index) {
      return renderAssists(player, index);
    });
  
  })
}

function renderAssists(player, index){
  $(".saved-players").append( `
    <div class="col-6">
    <div class="player">
      ${ player.player.FirstName ? `<img class="player-image" src="https://nba-players.herokuapp.com/players/${player.player.LastName}/${player.player.FirstName}" />`: "" }
     <p>Rank: ${index+1}</p>
     <p>${player.player.FirstName} ${player.player.LastName}</p>
     <p>${player.team.City} ${player.team.Name}</p>
     <p class="highlight">Assists Per Game: ${player.stats.AstPerGame['#text']}</p>
    </div>
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
$(instructionsOn)
$(instructionsOff);
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
$(savedPlayersClick)
$(removeSavedPlayers)
$(removeFromHome)