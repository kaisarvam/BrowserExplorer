import { useId } from 'react';
import styled from 'styled-components';
import { CloseIcon, SearchIcon, TextInput } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectSearchQuery } from '@/store/selectors';
import { searchCleared, searchQueryChanged } from '@/store/workspaceSlice';

const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.xs};
`;

const Caption = styled.label`
	display: inline-flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.xs};
	align-self: flex-start;
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const Controls = styled.div`
	position: relative;
	display: flex;
`;

const SearchInput = styled(TextInput)`
	padding-right: 2.5rem;

	&::-webkit-search-cancel-button,
	&::-webkit-search-decoration {
		appearance: none;
	}
`;

const ClearButton = styled.button`
	position: absolute;
	top: 50%;
	right: ${({ theme }) => theme.spacing.sm};
	display: grid;
	place-items: center;
	width: 1.5rem;
	height: 1.5rem;
	padding: 0;
	transform: translateY(-50%);
	border: none;
	border-radius: ${({ theme }) => theme.radii.sm};
	background: none;
	color: ${({ theme }) => theme.colors.textMuted};
	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.colors.surface};
		color: ${({ theme }) => theme.colors.text};
	}
`;

export function SearchField() {
	const dispatch = useStoreDispatch();
	const searchQuery = useStoreSelector(selectSearchQuery);
	const inputId = useId();

	return (
		<Field>
			<Caption htmlFor={inputId}>
				<SearchIcon aria-hidden='true' />
				Search the whole workspace
			</Caption>

			<Controls>
				<SearchInput
					id={inputId}
					type='search'
					value={searchQuery}
					placeholder='Search folders and files'
					onChange={(event) => dispatch(searchQueryChanged(event.target.value))}
					onKeyDown={(event) => {
						if (event.key === 'Escape' && searchQuery !== '') {
							dispatch(searchCleared());
						}
					}}
				/>

				{searchQuery !== '' && (
					<ClearButton
						type='button'
						aria-label='Clear search'
						onClick={() => dispatch(searchCleared())}
					>
						<CloseIcon aria-hidden='true' />
					</ClearButton>
				)}
			</Controls>
		</Field>
	);
}
