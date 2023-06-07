function Autocomplete(inputElement, options) {
    this.inputElement = inputElement;
    this.options = options;
    this.suggestionList = document.createElement('ul');
    this.suggestionList.classList.add('suggestion-list');
    this.inputElement.parentNode.appendChild(this.suggestionList);
  
    var self = this;
  
    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  
    function clearSuggestions() {
      self.suggestionList.innerHTML = '';
    }
  
    function selectItem(item) {
      self.inputElement.value = item;
      clearSuggestions();
      self.options.onSelect && self.options.onSelect(item);
    }
  
    function renderSuggestions(data) {
      if (data && data.length > 0) {
        clearSuggestions();
        data.forEach(function (item) {
          var listItem = document.createElement('li');
          listItem.textContent = item.name;
          listItem.addEventListener('click', function () {
            selectItem(item.name);
          });
          self.suggestionList.appendChild(listItem);
        });
      } else {
        clearSuggestions();
      }
    }
  
    function fetchSuggestions(query) {
      var url =
        'https://api.openweathermap.org/data/2.5/find?q=' +
        query +
        '&appid=' +
        apiKey;
      fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          renderSuggestions(data.list);
        })
        .catch(function (error) {
          console.error('Error fetching suggestions:', error);
        });
    }
  
    var debouncedFetch = debounce(fetchSuggestions, options.debounceTime);
  
    this.inputElement.addEventListener('input', function (event) {
      var inputValue = event.target.value;
      if (inputValue.length >= options.minChars) {
        debouncedFetch(inputValue);
      } else {
        clearSuggestions();
      }
    });
  
    this.inputElement.addEventListener('keydown', function (event) {
      var keyCode = event.keyCode;
      var selectedSuggestion = self.suggestionList.querySelector(
        'li.selected'
      );
  
      if (keyCode === 13 && selectedSuggestion) {
        event.preventDefault();
        selectItem(selectedSuggestion.textContent);
      } else if (keyCode === 38 && selectedSuggestion) {
        event.preventDefault();
        var previousSuggestion = selectedSuggestion.previousElementSibling;
        if (previousSuggestion) {
          selectedSuggestion.classList.remove('selected');
          previousSuggestion.classList.add('selected');
        }
      } else if (keyCode === 40 && selectedSuggestion) {
        event.preventDefault();
        var nextSuggestion = selectedSuggestion.nextElementSibling;
        if (nextSuggestion) {
          selectedSuggestion.classList.remove('selected');
          nextSuggestion.classList.add('selected');
        }
      } else if (keyCode === 27) {
        clearSuggestions();
      }
    });
  }
  