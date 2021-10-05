<script>
import Editor from './editor.svelte';
import {parseOfftext} from 'pitaka/offtext'
import {renderHTML} from 'pitaka/offtext'
import {editingtext} from './store.js';
let htmloutput='',tagsoutput='';

let res={text:'',tags:[]};
$:  {
	res = parseOfftext($editingtext); 
	htmloutput= renderHTML(res.text,res.tags);
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

	
	.main {display:flex;flex-direction:row;width:100vw;}
	.left {width:50%;overflow-y:none;}
	.right {width:50%;overflow-y:auto;flex-direction: column;}
	.htmloutput {height:50%;white-space: pre-wrap;}
	.tagsoutput {height:50%;white-space:pre-wrap}
	.output {height:50%;white-space: pre-wrap;}
	
    
</style>