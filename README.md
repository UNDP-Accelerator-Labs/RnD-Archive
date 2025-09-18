# Welcome the UNDP Accelerator Labs R&D Archive

This archive compiles all the documentation of the UNDP Accelerator Labs Network Codification Fests. It aims to provide innovation practitioners in public sector institutions with knowledge, skills, tools, methods, principles, and tactics that they can use in their work. This knowledge was developed and compiled by the Network over its 6 years of existance within UNDP.

# How to contribute

This R&D Archive is a light-weight, flexible wiki-like platform.

## Adding a simple route and page

To add a simple route and page, you must:

1. add a name for the route and page in `routing.json`. This will automatically add a button in the main navigation bar at the bottom of the interface.
2. add a directory (folder) in the `root` of the project with the same name as in `routing.json`. For reference, we call these *routing directories*.
3. add a `README.md` file inside the directory for the content of the page.
4. copy/ paste the `templates/index.html` file inside the directory for rendering the page template. Note that you may need to edit the relative paths manually in the `index.html` template to always point to the `root` of the project (where the `/public` assets are).

For example, to create the `/about` route and page, you would need to add the string `"about"` to the list of routes in `routing.json` and create an `/about` *routing directory* at the `root` of the project. You would then need to create a `about/README.md` file to add your content in markdown syntax. Finally, you would need to copy/ paste `templates/index.html` to `about/index.html`—in this particular case, you would not need to edit the paths to the public assets, as by default they are set to look in the parent directory.

Once you have this set up, all you need to edit is the `.md` file. The `index.html` file is only a template for rendering the content. Only change it if you want to tweak the display of the page—this is not recommended here.

Note that not all directories in the `root` of the project are not *routing directories*. For example, navigating to `{base url}/public` will result in a 404 error. This is because it is not included in the `routing.json` file, and it has no `index.html` file inside it.

## Adding subpages

The general approach for adding subpages is to add a `./__pages__/` subdirectory to a *routing directory* with any number of `.md` (markdown) files in it. 

If you are only planning to add subpages to the existing `elements/` and `stories/` *routing directories*, you can go straight to the **Adding elements and stories** section, as indexing and linking is handled automatically for these *routing directories*. Otherwise, please read through the next section.

## Navigating to subpages

For a user to be able to navigate to a subpage, the `{routing directory}/README.md` file needs to contain a link to that page. However, the routing is particular here, because the structure is not standard (TO DO: WHY IS THE STRUCTURE NOT STANDARD: NON TECHNICAL PEOPLE ARE THE MAIN EDITORS/ CONTRIBUTORS). 

For the `elements/` and `stories/` subpages, the linking is handled automatically and you have nothing to do. However, for any new *routing directory* you might create, you will need to add the navigation manually—at least for now (this is a pending *TO DO* item for a future release).

To add links to the subpages manually, you must follow this syntax (based on the standard markdown hyperlink syntax):
```[name of page](./?doc={the name of the .md file to use as a subpage})```
replacing:
- `name of page` with the name you want to see displayed—keeping the square brackets to maintain the standard markdown hyperlink syntax; and
- `{the name of the .md file to use as a subpage}` with the actual name of the `.md` file under `./__pages__/`—removing here the curly brackets and omitting the `.md` file extension. Note that you only need to add the name of the file, not the path—e.g., use `supbage` and not `./__pages__/subpage`.

For example, to manually create a subpage to your *routing directory*, you must:

1. create a `./__pages__/` subdirectory in your *routing directory*.
2. add a `subpage.md` file to the subdirectory, i.e., `./__pages__/subpage.md`.
3. add `[my subpage](./?doc=subpage)` anywhere in the `README.md` file inside your *routing directory* to make sure users can navigate to your subpage.

## Adding elements and stories

The bulk of the R&D Archive is a collection of **elements of innovation**, namely *principles*, *skills*, *tactics*, and *tools and methods*; and of **stories** told by Accelerator Lab members that give perspective to each of the **elements** by illustrating their application to sustainable development practice.

The different **elements** and **stories** are respectively stored in the `elements/__pages__/` and `stories/__pages__/` directories. Each is a unique "augmented" `.md` file.

### Additional markdown tags for elements

**Elements** are tagged by type. By default, these are:
- *principles*
- *skills*
- *tactics*
- *tools*
They correspond to the name of one of the subdirectories of the `elements/` *routing directory*.

Depending on how an *element* is applied, it may be a *principle*, a *skill*, a *tactic*, or a *tool or method*. For example, [being open by default](/elements/__pages__/Be%20open%20by%20default.md) can either be a *principle* that guides one's work, or a *tactic* to scale the adoption of that work.

To add a *type tag* to an *element page*, you must follow the syntax:
```
[[type:{the type of element}]]
```
replacing `{the type of element}` with the name of one of the *type tags*—removing the curly brackets. Make sure to place the *type tag* **at the top of the .md document.**

When the application builds, the `scripts/compile_element_index.py` file should automatically link and index the **element** to the appropriate route(s) and page(s). 
For example, an `element_name.md` in `elements/__pages__/` with the *type tag* `[[type:principles]]` at the top of the document will be accessible at `{base url}/elements/principles/?doc=element_name`. A link to this page will also automatically be generated in the index content pages `elements/README.md` and `elements/principles/README.md`.

Note a single *element* page can have multiple *type tags*.
For example, if you add `[[type:skills]]` at the top of the same `element_name.md`, then your subpage shoud also be accessible at `{base url}/elements/skills/?doc=element_name`, and the automatic indexing should apply to `elements/README.md` and `elements/skills/README.md` as well.

If you want to create a new type, you must:
1. add a directory with the name of the type in `elements/`.
2. add a `README.md` file inside the directory for the content of the page.
3. copy/ paste the `templates/index.html` file inside the directory for rendering the page template. Note that you will need to edit the relative paths manually in the `index.html` template to always point to the `root` of the project (where the `/public` assets are).
4. add the `[[type:{your new tag type}]]` at the top of your `elements/__pages__/subpage.md` page.

Following these steps should ensure that all the automatic indexing works properly.

### Additional markdown tags for stories

**Stories** are generally based on audio recordings and their transcripts in the R&D Archive. To link an audio file to a *story page*, you must follow the syntax:
```
[[audio:{url to .mp3 file stored publicly anywhere online}]]
```
**at the top of the .md document**
replacing `{url to .mp3 file stored publicly anywhere online}` with a valid absolute or relative url—removing the curly brackets. Make sure to place the tag **at the top of the .md document.**

In addition, if the rest of the content is a transcript of the audio file—which is generally the case here, or if at least different paragraphs relate to different temporal sequences in the audio, you can link the text and audio by adding a *timestamp*.

To add a *timestamp*, you must follow the syntax:
```
[[%M:%S]]
```
where:
- `%M` is a zero-padded decimal number for the minutes (e.g., 30)—note that this should also work without the zero-padding (e.g., 5 and 05 should both work); and 
- `%S` as a zero-padded decimal number for the seconds (e.g., 09).
Make sure to place the *timestamp* **at the beginning of the relevant title section or paragraph.**

The synchronization between text and audio is then automatically handled by the javascript modules [public/js/audio.mjs](/public/js/audio.mjs), [public/js/transcript.mjs](/public/js/transcript.mjs) and [public/js/visualization.mjs](public/js/visualization.mjs).

Finally, paragraphs in the **stories** can be linked to different **elements**. While a single paragraph/ part of a story can theoretically be related to any number of **elements**, the standard here is a **maximum of four** *element tags* per paragraph. These can be of any (element) *tag type*.

To add an *element tag*, you must follow the syntax:
```
[[{tag type}:{name of related element .md file}]]
```
replacing:
- `{tag type}` with one of the *tag types* described in the previous section (by default: `principles`, `skills`, `tactics`, or `tools`)—removing the curly brackets; and
- `{name of the related element .md file}` with the unescaped name of the **element** `.md` file in `elements/__pages__/`—here again, removing the curly bracket.
Make sure to place the *element tag* **at the top of the related paragraph.**

For example, if a paragraph in a **story** talks about using [personas](/elements/__pages__/Personas.md), you can link the *personas* **element** as a *tool* by adding the *element tag* `[tools:Personas]` right before that paragraph.

When the application builds, the `scripts/compile_element_links.py` and `scripts/compile_stories_index.py` files should automatically index the **sotries** and link them to the tagged **elements**. 
For example, a `story_name.md` in `stories/__pages__/` will be accessible at `{base url}/stories/?doc=element_name`, and the `[tools:Personas]` *element tag* should link to `{base url}/elements/tools/?doc=Personas`.

### Editing elements and stories
When navigating the R&D Archive, you can edit any **story** or **element** by clicking on the auto-rendered "Edit this page" link at the top of the page. If you are a contributor to this project, this will lead you directly to the github markdown editor.