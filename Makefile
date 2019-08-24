lint:
	npx eslint **/*.js
	npx stylelint **/*.css

prod:
	npx now --prod

dev:
	npx now dev
