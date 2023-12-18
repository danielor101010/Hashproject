document.addEventListener('DOMContentLoaded', function () {
    const tableContainers = document.querySelectorAll('.table-container');
    const valuesInput = document.getElementById('values');
    const verticalDiv = document.getElementById('verticalDiv');
    const tableSizeInput = document.getElementById('table-size');
  
    let currentTable = null;
    let currentIndex = null;
  
    function createCell(cellValue) {
        const cellContainer = document.createElement('div');
        cellContainer.classList.add('cell-container');
      
        const cell = document.createElement('div');
        cell.classList.add('table-cell');
        cell.style.height = '25px';
      
        const valueDiv = document.createElement('div');
        valueDiv.classList.add('value-div');
        valueDiv.textContent = cellValue; 
        cell.appendChild(valueDiv);
        cellContainer.appendChild(cell);
      
        return cellContainer;
      }
  
    function generateTable(tableContainer) {
      const tableSize = 12;
      const table = tableContainer.querySelector('.table');
      table.innerHTML = '';
  
      for (let i = 0; i < tableSize; i++) {
        const cellContainer = createCell('');
        table.appendChild(cellContainer);
      }
    }
  
    function clearTable(tableContainer) {
      const table = tableContainer.querySelector('.table');
      table.querySelectorAll('.value-div').forEach(div => (div.textContent = ''));
      const resultContainer = tableContainer.querySelector('.result-container');
      if (resultContainer) {
        resultContainer.remove();
      }
    }
  
    function insertDataLinear(tableContainer) {
      const { inputValues, table } = splitInput(tableContainer, valuesInput);
    
      let collisions = 0;
      let startTime = performance.now();
      var verticalDiv = document.getElementById("verticalDiv");
    
      inputValues.forEach((value, i) => {
        setTimeout(() => {
          let index = value % 12;
          verticalDiv.style.backgroundColor = "transparent"; // Set background to transparent initially
          
          while (table.children[index].querySelector('.value-div').textContent !== '') {
            verticalDiv.style.backgroundColor = "red"; // Collision occurred, set background to red
            index = (index + 1) % 12;
            collisions++; // Update collisions on each collision
          }
          
          table.children[index].querySelector('.value-div').textContent = value;
          currentIndex = index;
    
          // Check if there was a collision in the specific cell
          const collisionInCell = table.children[index].querySelector('.value-div').classList.contains('collision-cell');
          moveVerticalDiv(tableContainer, collisionInCell);
          
          if (i === inputValues.length - 1) {
            displayResults({ time: performance.now() - startTime, collisions }, 'Linear Probing', tableContainer);
          }
        }, i * 1000);
      });
    }
    
  
      
  
    function insertDataQuadratic(tableContainer) {
      const { inputValues, table } = splitInput(tableContainer, valuesInput);

  
      let collisions = 0;
      let startTime = performance.now();
      var verticalDiv = document.getElementById("verticalDiv");

  
      inputValues.forEach((value, i) => {
        setTimeout(() => {
          verticalDiv.style.backgroundColor = "transparent"; // Set background to transparent initially
          let index = value % 12; 
          let offset = 1;
  
          while (table.children[index].querySelector('.value-div').textContent !== '') {
            index = (index + Math.pow(offset, 2)) % 12;
            verticalDiv.style.backgroundColor = "red"; // Collision occurred, set background to red
            offset++;
            collisions++;
          }
  
          table.children[index].querySelector('.value-div').textContent = value;
          currentIndex = index;
  
          moveVerticalDiv(tableContainer);
          if (i === inputValues.length - 1) {
            displayResults({ time: performance.now() - startTime, collisions }, 'Quadratic Probing', tableContainer);
          }
        }, i * 1000); // Delay each insertion by 1 second
      });
    }
  
    function insertDataDouble(tableContainer) {
      const { inputValues, table } = splitInput(tableContainer, valuesInput);
  
      let collisions = 0;
      let startTime = performance.now();
      var verticalDiv = document.getElementById("verticalDiv");

  
      inputValues.forEach((value, i) => {
          setTimeout(() => {
            verticalDiv.style.backgroundColor = "transparent"; // Set background to transparent initially
              let index = value % 12; // Initial hash
              const hash2 = 5 - (value % 5); // Adjusted second hash
  
              while (table.children[index].querySelector('.value-div').textContent !== '') {
                  verticalDiv.style.backgroundColor = "red"; // Collision occurred, set background to red
                  index = (index + hash2) % 12;
                  collisions++;
              }
  
              table.children[index].querySelector('.value-div').textContent = value;
              currentIndex = index;
  
              moveVerticalDiv(tableContainer);
              if (i === inputValues.length - 1) {
                  displayResults({ time: performance.now() - startTime, collisions }, 'Double Hashing', tableContainer);
              }
          }, i * 1000);
      });
  }
  
  
    function insertDataChaining(tableContainer) {
      const { inputValues, table } = splitInput(tableContainer, valuesInput);

      let collisions = 0;
      let startTime = performance.now();
      var verticalDiv = document.getElementById("verticalDiv");

  
      const hashTable = new Array(12).fill(null).map(() => []);
  
      inputValues.forEach((value, i) => {
        setTimeout(() => {
          verticalDiv.style.backgroundColor = "transparent"; // Set background to transparent initially
          const index = value % 12; // Fixed size of 12 cells
          hashTable[index].push(value);
  
          // Update the display based on the hashTable
          table.innerHTML = '';
          for (let i = 0; i < 12; i++) {
            const cellContainer = createCell(hashTable[i].join(','));
            table.appendChild(cellContainer);
          }
  
          moveVerticalDiv(tableContainer);
          if (i === inputValues.length - 1) {
            displayResults({ time: performance.now() - startTime, collisions }, 'Separate Chaining', tableContainer);
          }
        }, i * 1000); 
      });
    }
  
    function moveVerticalDiv(tableContainer, collisionInCell) {
      const tableRect = tableContainer.getBoundingClientRect(); // Get the bounding rect of the table container
      const cellRect = tableContainer.querySelector('.table').children[currentIndex].getBoundingClientRect();
  
      verticalDiv.style.left = `${cellRect.left - tableRect.left}px`;
      verticalDiv.style.top = `${cellRect.top}px`;
  
      const currentCellValue = tableContainer.querySelector('.table').children[currentIndex].querySelector('.value-div').textContent;
      verticalDiv.textContent = currentCellValue;
  
      if (collisionInCell) {
          verticalDiv.classList.add('collision'); // Add the 'collision' class
      } else {
          verticalDiv.classList.remove('collision'); // Remove the 'collision' class if no collisions
      }
  }
  
  
      
      
      
  
    function displayResults(result, algorithm, tableContainer) {
      const resultContainer = document.createElement('div');
      resultContainer.classList.add('result-container');
  
      const resultText = document.createElement('p');
      resultText.textContent = `Algorithm: ${algorithm}, Time: ${result.time.toFixed(2)} ms, Collisions: ${result.collisions}`;
  
      resultContainer.appendChild(resultText);
      tableContainer.appendChild(resultContainer);
    }
  
    tableContainers.forEach((tableContainer, index) => {
      generateTable(tableContainer);
  
      const insertButtons = tableContainer.querySelectorAll('.insert-button');
      insertButtons.forEach(insertButton => {
        insertButton.addEventListener('click', () => {
          clearTable(tableContainer);
          switch (insertButton.getAttribute('data-algorithm')) {
            case 'Linear Probing':
              insertDataLinear(tableContainer);
              break;
            case 'Quadratic Probing':
              insertDataQuadratic(tableContainer);
              break;
            case 'Double Hashing':
              insertDataDouble(tableContainer);
              break;
            case 'Separate Chaining':
              insertDataChaining(tableContainer);
              break;
            default:
              break;
          }
        });
      });
    });
  });

function splitInput(tableContainer, valuesInput) {
  const table = tableContainer.querySelector('.table');
  const inputValues = valuesInput.value.split(',').map(value => parseInt(value.trim(), 10)).filter(value => !isNaN(value));
  return { inputValues, table };
}
  