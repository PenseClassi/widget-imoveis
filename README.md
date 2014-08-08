widget-imoveis
==============

Repositorio do Pense para a Lib do widget

## Libraries

### Template
http://handlebarsjs.com/

### jQuery API
http://zeptojs.com/


## Samples
 
 Encontrados dentro da pasta examples


## Uso

Apenas Incluir o codigo abaixo no segmento de html desejado ou indicar o id do elemento aonde ira ser renderizado.

```html
<!--  INCLUDE PENSE WIDGET LIB -->
<script type="text/javascript"
    src="../pense-widget.js?project={ID}&partner={NOME}&hash={AUTH_HASH}&type={TYPE}&element_id={ID_HTML_EL}"
    async></script>
<!-- END PENSE WIDGET LIB -->
```

Parametros de inclusao do widget:

###Parametros Inclusão
<ol>
	<li>
		<h3>project</h3>
		<i>Integer</i> - Código do projeto que está sendo usado para inclusão do widget
	</li>
	<li>
		<h3>partner</h3>
		<i>String</i> - Nome do parceiro que está usando o codigo
	</li>
	<li>
		<h3>hash</h3>
		<i>String</i> - Hash que contém a liberação do acesso
	</li>
	<li>
		<h3>type</h3>
		<i>Enum (search,list,anuncio)</i> - Indica qual layout de widget deve ser iniciado
	</li>
	<li>
		<h3>element_id</h3>
		<i>String (Opcional)</i> - Id do elemento que irá ser renderizado 
	</li>
	
</ol>
