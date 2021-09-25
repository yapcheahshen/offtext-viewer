<script>
import { onMount } from 'svelte';

import parse from './parser.js'
import render from './render.js'
let output='xx',tagsoutput='';
const refresh=evt=>{
	let s=document.querySelector("#inputtext").value;
	const {text,tags}=parse(s);
	output=render(text,tags,{});
	tagsoutput=JSON.stringify(tags).replace(/\],\[/g,'],\n[');
}
onMount(()=>refresh());
</script>
<div class="main">
	<div class="left">
<textarea id="inputtext"  on:input={refresh}>^book#12道德經
道，可道也，非^r[恆 原文=常 出處=馬王堆帛書]道也。名，可名也，非^r[o=常 恆]名也。
無，名^b[~物]天地之始；有，名^red[萬物之母]。
故，常^b~3無，欲以觀其妙；常^b[有]，欲以觀其徼。
此兩者，同出而異名，同謂之玄。玄之又玄，眾妙之門。

五色令人目盲；五音令人耳聾；五味令人口爽；
馳騁畋獵，令人心發狂；難得之貨，令人行妨。
是以聖人為腹不為目，故去彼取此。</textarea>
<div class="tagsoutput">{tagsoutput}</div>
	</div>
	<div class="right">
		<div class="htmloutput">{@html output}</div>
		<div class="output">{output}</div>
	</div>


</div>
<style>
	:global(.book){
		color:blue
	}
	:global(.b) {font-weight: bold	}
	:global(.i) {font-style: italic	}
	:global(.u) {text-decoration:underline}
	:global(.red) {color:red}
	
	.main {display:flex;flex-direction:row;width:100vw;}
	textarea {width:95%;height:45%;font-size:1rem}
	.left {width:50%;overflow-y:auto;}
	.right {width:50%;overflow-y:auto;flex-direction: column;}
	.htmloutput {height:50%;white-space: pre-wrap;}
	.tagsoutput {height:50%;white-space:pre-wrap}
	.output {height:50%;white-space: pre-wrap;}
	

</style>