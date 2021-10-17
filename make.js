/* eslint-env node */
import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { html } from './public/html/html.js';

const { compare } = new Intl.Collator('en', { numeric: true });
const ignoredPaths = ['assets', 'demo', 'index.html'];

async function main() {
	const children = [
		...(await dirToObject('.')),
		{
			type: 'file',
			name: 'GitHub',
			path: 'https://github.com/shannonmoeller/code',
		},
	];

	const html = String(renderPage(children)).trim();

	await writeFile('public/index.html', html);
}

async function dirToObject(dir) {
	const contents = await readdir(join('public', dir), {
		withFileTypes: true,
	});

	contents.sort((a, b) => {
		return compare(a.name, b.name);
	});

	const dirs = [];
	const files = [];

	for (const entry of contents) {
		const { name } = entry;
		const path = join(dir, name);

		if (entry.isSymbolicLink() || isIgnored(path)) {
			continue;
		}

		if (entry.isDirectory()) {
			dirs.push({
				type: 'directory',
				name,
				path,
				children: await dirToObject(path),
			});
		}

		if (entry.isFile()) {
			files.push({
				type: 'file',
				name,
				path,
			});
		}
	}

	return [...dirs, ...files];
}

function isIgnored(path) {
	return ignoredPaths.some((x) => {
		return path.startsWith(x);
	});
}

function renderPage(children) {
	return html`
		<!DOCTYPE html>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<title>code</title>

		<script type="module">
			import '/assets/index.js';
		</script>

		<style>
			@import '/assets/index.css';
		</style>

		${renderTree(children)}
	`;
}

function renderTree(children) {
	return html`
		<ol class="tree">
			${children.map((child) =>
				child.type === 'directory' ? renderDirectory(child) : renderFile(child)
			)}
		</ol>
	`;
}

function renderDirectory(dir) {
	return html`
		<li class="tree-dir">
			<details class="tree-dir" data-path="${dir.path}">
				<summary>${dir.name}/</summary>
				${renderTree(dir.children)}
			</details>
		</li>
	`;
}

function renderFile(file) {
	const isHtml = file.path.endsWith('.html');

	return html`
		<li class="tree-file">
			<a href="${file.path}">${file.name}</a>
			${isHtml && html`<a href="/demo/#!/${file.path}">◧</a>`}
		</li>
	`;
}

main().catch(console.error);
