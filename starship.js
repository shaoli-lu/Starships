function run(genFunc) {
  const genObject = genFunc();

  function iterate(iteration) {
    if (iteration.done) {
      return Promise.resolve(iteration.value);
    }
    return Promise.resolve(iteration.value).then(
      x => iterate(genObject.next(x))
    ).catch(
      x => iterate(genObject.throw(x))
    );
  }

  try {
    return iterate(genObject.next());
  } catch (ex) {
    return Promise.reject(ex);
  }
}

function* gen() {
  const firstStarship = document.getElementById('firstStarship');
  const secondStarship = document.getElementById('secondStarship');
  // check input
  if (firstStarship.value === secondStarship.value) {
    throw new Error("Please select two different starship to compare!");
  }
  //fetch data
  
  let nameRow = document.getElementById('row-name'),
    costRow = document.getElementById('row-cost'),
    speedRow = document.getElementById('row-speed'),
    cargoRow = document.getElementById('row-cargo-size'),
    passengerRow = document.getElementById('row-passengers');

  let rows = [nameRow, costRow, speedRow, passengerRow, cargoRow];  

  let firstStarshipResponse = yield fetch('https://swapi.dev/api/starships/' + firstStarship.value);
  let firstStarshipData = yield firstStarshipResponse.json();

  let secondStarshipResponse = yield fetch('https://swapi.dev/api/starships/' + secondStarship.value);
  let secondStarshipData = yield secondStarshipResponse.json();
  
  yield fillForm(firstStarshipData, 1);
  yield fillForm(secondStarshipData, 2);
  yield compare();

  function fillForm(data, number) {
    let name = data.name,
    cost = data.cost_in_credits,
    speed = data.max_atmosphering_speed,
    passengers = data.passengers,
    cargo_capacity = data.cargo_capacity;
    let dataFields = [name, cost, speed, passengers, cargo_capacity];
    
    if (number === 1) {
      for (let i = 0; i < rows.length; i++) {
        let secondCell = rows[i].querySelector('td:nth-child(2)');
        secondCell.textContent = dataFields[i];
      }
    } else if (number === 2) {
      for (let i = 0; i < rows.length; i++) {
        let thirdCell = rows[i].querySelector('td:nth-child(3)');
        thirdCell.textContent = dataFields[i];
      }
    }
  }

  function compare() {
    for (let i = 0; i < rows.length; i++) {
      let secondCell = rows[i].querySelector('td:nth-child(2)');
      let thirdCell = rows[i].querySelector('td:nth-child(3)');
      if (Number(secondCell.textContent) > Number(thirdCell.textContent)) {
        secondCell.style.backgroundColor = 'red';
      } else if (Number(secondCell.textContent) < Number(thirdCell.textContent)) {
        thirdCell.style.backgroundColor = 'red';
      } else {
        continue;
      }
    }
  }
}

document.getElementById('compareBtn').addEventListener('click', function () { 
  run(gen).catch(function (err) {
    alert(err)
  })
});