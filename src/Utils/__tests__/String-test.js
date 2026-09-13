import { IsEmail, StrIsJSON, ParsePlural, FormatForSearch, CleanLink } from '../String';

describe('[Utils] String', () => {
    describe('IsEmail', () => {
        it.each(['a@b.co', 'first.last@example.com', 'user-name@sub.domain.org'])('should accept %s', (email) => {
            expect(IsEmail(email)).toBe(true);
        });

        it.each(['', 'no-at-sign', 'missing@tld', '@example.com', 'spaced mail@example.com'])(
            'should reject %s',
            (email) => {
                expect(IsEmail(email)).toBe(false);
            }
        );

        it('should reject a non-string input', () => {
            // @ts-ignore Deliberately invalid input
            expect(IsEmail(null)).toBe(false);
        });
    });

    describe('StrIsJSON', () => {
        it('should accept a JSON object, array and scalar', () => {
            expect(StrIsJSON('{"a":1}')).toBe(true);
            expect(StrIsJSON('[1,2]')).toBe(true);
            expect(StrIsJSON('42')).toBe(true);
        });

        it('should reject malformed JSON', () => {
            expect(StrIsJSON('{a:1}')).toBe(false);
            expect(StrIsJSON('')).toBe(false);
        });
    });

    describe('ParsePlural', () => {
        const text = 'The following sentence[s] is[--are] singular[--------plural]';

        it('should drop every bracketed part in the singular form', () => {
            expect(ParsePlural(text, false)).toBe('The following sentence is singular');
        });

        it('should apply every bracketed part in the plural form', () => {
            expect(ParsePlural(text, true)).toBe('The following sentences are plural');
        });

        it('should leave a text without brackets untouched', () => {
            expect(ParsePlural('Nothing to do', true)).toBe('Nothing to do');
        });
    });

    describe('FormatForSearch', () => {
        it('should lowercase, strip accents and trim', () => {
            expect(FormatForSearch('  ÉCOLE Élémentaire ')).toBe('ecole elementaire');
        });

        it('should make two differently accented spellings comparable', () => {
            expect(FormatForSearch('Café')).toBe(FormatForSearch('CAFE'));
        });
    });

    describe('CleanLink', () => {
        it('should strip the scheme and the trailing slashes', () => {
            expect(CleanLink('https://example.com/')).toBe('example.com');
            expect(CleanLink('http://example.com///')).toBe('example.com');
        });

        it('should keep a link that is already clean', () => {
            expect(CleanLink('example.com/path')).toBe('example.com/path');
        });
    });
});
