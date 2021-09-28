<script>
  /*https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/ */
import { onMount } from "svelte";
import {editingtext} from "./store.js"
import render from './render.js'
import highlight from './highlighter.js'

let output='';

function update(evt) {
    if(!evt) return;
    let etext=evt;
    if (typeof evt.target!=='undefined') {
      etext=evt.target.value;
    }
    // Handle final newlines (see article)
    if(editingtext[etext.length-1] == "\n") {
      etext += " ";
    }
    const s=etext.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");

    $editingtext=etext;
    output=highlight(s);
}
  
function sync_scroll(evt) {
  const element=evt.target;
  /* Scroll result to scroll coords of event - sync with textarea */
  let result_element = document.querySelector("#highlighting");
  // Get and set x and y
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
}
  
function check_tab(evt) {
  const element=evt.target;
  let code = element.value;
  if(evt.key == "Tab") {
    /* Tab key pressed */
    evt.preventDefault(); // stop normal
    let before_tab = code.slice(0, element.selectionStart); // text before tab
    let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
    let cursor_pos = element.selectionEnd + 1; // where cursor moves after tab - moving forward by 1 char to after tab
    element.value = before_tab + "\t" + after_tab; // add tab char
    // move cursor
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    update(element.value); // Update text to include indent
  }
}

function oninput(evt) {
  update(evt)
  sync_scroll(evt);
}
onMount(()=>{
    update(document.querySelector('#editing').value)
})
</script>


<div style="height: 200px;">
<textarea id="editing" spellcheck="false" on:input={oninput} on:scroll={sync_scroll} on:keydown={check_tab}>{$editingtext}</textarea>
<pre id="highlighting" aria-hidden="true"><code class="language-html" id="highlighting-content">{@html output}</code></pre>
</div>

<style>

  :global(.offtag-op) {
    /* color:rgba(0,0,0,0.3); */
    color:burlywood;
  }
  :global(.offtag-name) {
    background:burlywood;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  :global(.offtag-bracket) {
    color:burlywood;
  }
  :global(.offtag-val) {
    color:firebrick
  }
  :global(.offtag-putback) {
    background:white;
    color:black;
  }
  :global(.offtag-attr) {
    color:olive
  }
  :global(.offtag-attributes) {
    background:wheat
  }
  :global(.offtag-blank) {
    border-bottom:1px solid burlywood;
  }
</style>