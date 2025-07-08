# Welcome the UNDP Accelerator Labs R&D Archive

This archive compiles all the documentation of the UNDP Accelerator Labs Network Codification Fests. It aims to provide innovation practitioners in public sector institutions with knowledge, skills, tools, methods, principles, and tactics that they can use in their work. This knowledge was developed and compiled by the Network over its 6 years of existance within UNDP.

# How to contribute

This R&D Archive is a light-weight, flexible wiki-like platform.

## Adding a simple route and page

To add a simple route and page, you must:

1. add a name for the route and page in `routing.json`.
2. add a directory (folder) in the `root` of the project with the same name as in `routing.json`. For reference, we call these *routing directories*.
3. add a `README.md` file inside the directory for the content of the page.
4. copy/ paste the `templates/index.html` file inside the directory for rendering the page template. Note that you may need to edit the relative paths manually in the `index.html` template to always point to the `root` of the project (where the `/public` assets are).

For example, to create the `/about` route and page, you would need to add the string `"about"` to the list of routes in `routing.json` and create an `/about` *routing directory* at the `root` of the project. You would then need to create a `about/README.md` file and add your content to it using markdown. Finally, you would need to copy/ paste `templates/index.html` to `about/index.html`—in this particular case, you would not need to edit the paths to the public assets, as by default they are set to look in the parent directory.

Note that not all directories in the `root` of the project are not *routing directories*. For example, navigating to `{full url}/public` will result in a 404 error. This is because it is not included in the `routing.json` file, and it has no `index.html` file inside it.

## Adding subpages

The general approach for adding subpages is to add a `./pages/` subdirectory to a *routing directory* with any number of `.md` (markdown) files in it. 

If you are only planning to add subpages to the existing `elements/` and `stories/` *routing directories*, you can go straight to the **Adding elements and stories** section, as indexing and linking is handled automatically for these *routing directories*. Otherwise, please read through the next section.

## Navigating to subpages

For a user to be able to navigate to a subpage, the `{routing directory}/README.md` file needs to contain a link to that page. However, the routing is particular here, because the structure is not standard (TO DO: WHY IS THE STRUCTURE NOT STANDARD: NON TECHNICAL PEOPLE ARE THE MAIN EDITORS/ CONTRIBUTORS). 

For the `elements/` and `stories/` subpages, the linking is handled automatically and you have nothing to do. However, for any new *routing directory* you might create, you will need to add the navigation manually—at least for now (this is a pending *TO DO* item for a future release).

To add links to the subpages manually, you must follow this syntax (based on the standard markdown hyperlink syntax):
```[name of page](./?doc={the name of the .md file to use as a subpage})```
replacing:
- `name of page` with the name you want to see displayed—keeping the square brackets to maintain the standard markdown hyperlink syntax; and
- `{the name of the .md file to use as a subpage}` with the actual name of the `.md` file under `./pages/`—removing here the curly brackets and omitting the `.md` file extension. Note that you only need to add the name of the file, not the path—e.g., use `supbage` and not `./pages/subpage`.

For example, to manually create a subpage to your *routing directory*, you must:

1. create a `./pages/` subdirectory in your *routing directory*.
2. add a `subpage.md` file to the subdirectory, i.e., `./pages/subpage.md`.
3. add `[my subpage](./?doc=subpage)` anywhere in the `README.md` file inside your *routing directory* to make sure users can navigate to your subpage.

## Adding elements and stories

The bulk of the R&D Archive is a collection of **elements of innovation**, namely *principles*, *skills*, *tactics*, and *tools and methods*; and of **stories** told by Accelerator Lab members that give perspective to each of the **elements** by illustrating their application to sustainable development practice.

The different **elements** and **stories** are respectively stored in the `elements/pages/` and `stories/pages/` directories. Each is a unique "augmented" `.md` file.

### Markdown augmentations for elements

Depending on how an *element* is applied, it may pertain to any of the *principles*, *skills*, *tactics*, and *tools and methods* categories. For example, [being open by default](/elements/pages/Be%20open%20by%20default.md) can either be a *principle* that guides ones work, or a *tactic* to scale the adoption of that work.


<!-- [[type:principles]] -->
<!-- [[type:skills]] -->