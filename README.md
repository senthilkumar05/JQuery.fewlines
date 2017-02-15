#JQuery.fewlines
JQuery.fewlines - is a light weight Jquery plugin to trim the text to specified number of rows.
  <p>The features are 
  <ul>
    <li>Show/hide action on ellipsis</li>
    <li>Just display ellipsis without any action</li>
    <li>Maintain specified number of rows on screen resize</li>
    <li>Show remaining text on mouse move on ellipsis</li>
    </ul>
   </p>

  <h2>Usage</h2>
  <p>It is easy to use</p>
   <pre>
  <code>
$('#demo1').fewlines({ lines:2 }); <i>//Show two lines of text with show and hide actions.</i>
$('#demo2').fewlines({ lines:2, noAction: true }); <i>//Show two lines only, no show/hide action.</i>
$('#demo3').fewlines({ lines:2, responsive: true }); <i>//Show two lines with screen resize support.</i>
$('#demo4').fewlines({ lines:2, showOnMouseOver:true }); <i>//Show two lines with mouse hover support.</i>
  </code>
</pre>
    
