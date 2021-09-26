<script>
import { text } from 'svelte/internal';
import Editor from './editor.svelte';
import parse from './parser.js'
import render from './render.js'
import {editingtext} from './store.js';
let htmloutput='',tagsoutput='';

let res={text:'',tags:[]};
$:  {
	res = parse($editingtext); 
	htmloutput= render(res.text,res.tags);
}

</script>
<div class="main">
	<div class="left">
		<Editor/>
		<div class="tagsoutput">{tagsoutput}</div>
	</div>
	<div class="right">
		<div class="htmloutput">{@html htmloutput}</div>
		<div class="output">{htmloutput}</div>
	</div>


</div>
<style>
	:global(.book){
		color:blue
	}

	:global(.li::before) { 
		background:linear-gradient(red,blue);
		display:inline-block;
		content:"";
		border-radius: 0.5em;
		margin-right:0.5em;
		height:1em;
		width:1em;
	}
	:global(.g) {
		color:brown
	}

	:global(.b) {font-weight: bold	}
	:global(.i) {font-style: italic	}
	:global(.u) {text-decoration:underline}
	:global(.red) {color:red}
	
	.main {display:flex;flex-direction:row;width:100vw;}
	.left {width:50%;overflow-y:none;}
	.right {width:50%;overflow-y:auto;flex-direction: column;}
	.htmloutput {height:50%;white-space: pre-wrap;}
	.tagsoutput {height:50%;white-space:pre-wrap}
	.output {height:50%;white-space: pre-wrap;}
	
    
</style>