// webpack.config.build.js
import path from 'path';

export default {
	mode: 'production',

	entry: './src/main.tsx',  // punctul de intrare

	output: {
		filename: 'bundle.js',
		path: path.resolve('./dist'),
		clean: true,            // curăţă dist înainte de build
	},

	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				use: {
					loader: 'ts-loader',
					options: {
						configFile: 'tsconfig.build.json',
					},
				},
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: { importLoaders: 1 },
					},
					'postcss-loader',
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext][query]',
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext][query]',
				},
			},
		],
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
};
