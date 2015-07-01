$(document).ready(function() {
    if(isAPIAvailable()) {
      $('#files').bind('change', handleFileSelect);
    }
	
	loadEmailPermutations();
	
	$('#startButton').click( processInputCSV );
	$('#findEmailsButton').click( processSinglePerson );
	
});

var apiKey = "";
var perms = [];
var outputData = [];
var file;
var qev;

function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      return true;
    } else {
      // source: File API availability - http://caniuse.com/#feat=fileapi
      // source: <output> availability - http://html5doctor.com/the-output-element/
      document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
      // 6.0 File API & 13.0 <output>
      document.writeln(' - Google Chrome: 13.0 or later<br />');
      // 3.6 File API & 6.0 <output>
      document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
      // 10.0 File API & 10.0 <output>
      document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
      // ? File API & 5.1 <output>
      document.writeln(' - Safari: Not supported<br />');
      // ? File API & 9.2 <output>
      document.writeln(' - Opera: Not supported');
      return false;
    }
}
  
  /*
  Was previously loading from dropbox, just going to load from local JS file now instead
  function loadEmailPermutations() {
	  $.ajax({
		url: "https://dl.dropboxusercontent.com/u/145217/permutations.csv",
		async: false,
		success: function (csvd) {
			data = $.csv2Array(csvd);
		},
		dataType: "text",
		complete: function () {
			for(var row in data) {
				perms.push(data[row][0]);
			}
		}
	});
  }
  */

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    file = files[0];

    // read the file metadata
    var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

    // read the file contents
    // processInputCSV(file);

    // post the results
    $('#list').append(output);
}
  
/* Takes JS array, converts it to CSV file, and then downloads it for
 * client user.
 */
function outputCSV( data ) {
	var csvContent = "data:text/csv;charset=utf-8,";
	
	data.forEach(function(infoArray, index){
		dataString = infoArray.join(",");
		csvContent += index < data.length ? dataString+ "\n" : dataString;
	});
	  
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");

	link.click(); // This will download the data file named "my_data.csv".
}

function isValidEmail( email ) {
	
	var xmlhttp = new XMLHttpRequest();
	var url = "https://gentle-sierra-2295.herokuapp.com/isvalidemail?email=" + email + "&apikey=" + apiKey;
	
	var result = false;

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var jsonData = JSON.parse(xmlhttp.responseText);
			if (jsonData.result == "valid") {
				result = true;
			}
		}
	}
	
	xmlhttp.open("GET", url, false);
	xmlhttp.send();
	
	return result;
}

function updateProgressBar( value ) {
	$("#status").attr("aria-valuenow", value.toString());
	$("#status").attr("style", "width:" + value.toString() + "%");
	$("#status").html(value.toString() + "% Complete");
}

function processSinglePerson( evt ) {
	rawPerson = {};
	rawPerson.firstName = $('#firstName').val();
	rawPerson.lastName = $('#lastName').val();
	rawPerson.domain = $('#domain').val();
	
	data = processPerson( rawPerson );
	
	for (row in data) {
		$('#resultsTable tbody').append("<tr><td>" + data[row][0] +"</td><td>" + data[row][1] + "</td><td>" + data[row][2] + "</td><td>" + data[row][3] + "</td></tr>");
	}
}

function processPerson( rawPerson ) {

	// Load API Key
	apiKey = $("#apiKey").val();

	var person = {};
	person.fn = rawPerson.firstName;
	person.fi = person.fn.substr(0,1);
	person.mn = '';
	person.mi = '';
	person.ln = rawPerson.lastName;
	person.li = person.ln.substr(0,1);
	person.domains = ['gmail.com']
	if (rawPerson.domain) {
		person.domains.push(rawPerson.domain);
	}
			
	var foundValidEmail = false;
	for (var i in person.domains) {
		var currDomain = person.domains[i];
				
		for (var j in perms) {
			var email = perms[j].replace('{fn}', person.fn)
			email = email.replace('{fi}', person.fi)
			email = email.replace('{mn}', person.mn)
			email = email.replace('{mi}', person.mi)
			email = email.replace('{ln}', person.ln)
			email = email.replace('{li}', person.li)
			email = email + '@' + currDomain;
			if ( isValidEmail(email) ) {
				foundValidEmail = true;
				outputData.push(person.fn, person.ln, currDomain, email]);
			}
		}
	}
			
	if (foundValidEmail) {
		foundValidEmail = false;
	}
	else {
		// No valid email found so write in person with 'N/A'
		outputData.push(person.fn, person.ln, rawPerson.domain, 'N/A']);
	}
	
	return outputData;
}
  
function processInputCSV( evt ) {

	// Load API Key
	apiKey = $("#apiKey").val();
	
	outputData = [];
	
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
		var csv = event.target.result;
		var data = $.csv.toArrays(csv);
	  
		for (var row in data) {
		
			var currProgress = Math.round(((row + 1) / data.length) * 100);
			updateProgressBar( currProgress );
		
			// Skip header row of input CSV file
			if (row == 0) {
				continue;
			}
			
			rawPerson = {};
			rawPerson.firstName = data[row][0].trim();
			rawPerson.lastName = data[row][1].trim();
			rawPerson.domain = data[row][2].trim();
			currOutputData = processPerson( rawPerson );
			
			outputData.extend(currOutputData);
		
			// Write blank row between each person
			outputData.push(['', '', '', '']);
		}
		
		outputCSV( outputData );
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}